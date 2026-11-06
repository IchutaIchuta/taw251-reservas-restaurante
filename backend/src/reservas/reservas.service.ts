import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { ClientesService } from '../clientes/clientes.service.js';
import { Mesa } from '../mesas/entities/mesa.entity.js';
import { MesasService } from '../mesas/mesas.service.js';
import { CreateReservaDto } from './dto/create-reserva.dto.js';
import { FiltroReservasDto } from './dto/filtro-reservas.dto.js';
import { MesasDisponiblesDto } from './dto/mesas-disponibles.dto.js';
import { UpdateReservaDto } from './dto/update-reserva.dto.js';
import { Reserva } from './entities/reserva.entity.js';

@Injectable()
export class ReservasService {
  // Cada reserva ocupa la mesa este tiempo (regla de negocio 1).
  private readonly bloqueHoras: number;

  constructor(
    @InjectRepository(Reserva)
    private readonly reservasRepository: Repository<Reserva>,
    private readonly mesasService: MesasService,
    private readonly clientesService: ClientesService,
    configService: ConfigService,
  ) {
    this.bloqueHoras = Number(configService.get('BLOQUE_RESERVA_HORAS', 2));
  }

  async create(createReservaDto: CreateReservaDto) {
    const { clienteId, mesaId, fecha, hora, cantidadPersonas } =
      createReservaDto;

    await this.clientesService.findOne(clienteId); // 404 si no existe
    const mesa = await this.mesasService.findOne(mesaId); // 404 si no existe
    this.validarNoPasada(fecha, hora);
    this.validarCapacidad(mesa, cantidadPersonas);
    await this.validarHorarioLibre(mesa, fecha, hora);

    const reserva = this.reservasRepository.create({
      clienteId,
      mesaId,
      fecha,
      hora,
      cantidadPersonas,
      observaciones: createReservaDto.observaciones ?? null,
      estado: 'pendiente',
    });
    const guardada = await this.reservasRepository.save(reserva);
    return this.findOne(guardada.id);
  }

  // Sin filtro de estado se ocultan las canceladas (borrado logico).
  findAll({ fecha, estado }: FiltroReservasDto) {
    const where: FindOptionsWhere<Reserva> = {
      estado: estado ?? Not('cancelada' as const),
    };
    if (fecha) where.fecha = fecha;

    return this.reservasRepository.find({
      where,
      relations: { cliente: true, mesa: true },
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  async findOne(id: number) {
    const reserva = await this.reservasRepository.findOne({
      where: { id },
      relations: { cliente: true, mesa: true },
    });
    if (!reserva) {
      throw new NotFoundException(`No existe la reserva con id ${id}`);
    }
    return reserva;
  }

  async update(id: number, updateReservaDto: UpdateReservaDto) {
    // Sin relaciones: asi al cambiar mesaId/clienteId no hay conflicto con
    // los objetos mesa/cliente cargados.
    const reserva = await this.reservasRepository.findOneBy({ id });
    if (!reserva) {
      throw new NotFoundException(`No existe la reserva con id ${id}`);
    }
    if (reserva.estado === 'cancelada') {
      throw new BadRequestException(
        'No se puede modificar una reserva cancelada',
      );
    }

    // Solo los campos enviados.
    const cambios = Object.fromEntries(
      Object.entries(updateReservaDto).filter(([, valor]) => valor !== undefined),
    ) as UpdateReservaDto;

    const nueva = {
      clienteId: cambios.clienteId ?? reserva.clienteId,
      mesaId: cambios.mesaId ?? reserva.mesaId,
      fecha: cambios.fecha ?? reserva.fecha,
      hora: cambios.hora ?? horaCorta(reserva.hora),
      cantidadPersonas: cambios.cantidadPersonas ?? reserva.cantidadPersonas,
    };
    const cambiaCliente = nueva.clienteId !== reserva.clienteId;
    const cambiaMesa = nueva.mesaId !== reserva.mesaId;
    const cambiaPersonas = nueva.cantidadPersonas !== reserva.cantidadPersonas;
    const cambiaHorario =
      nueva.fecha !== reserva.fecha || nueva.hora !== horaCorta(reserva.hora);

    // Las reglas solo se revisan si cambia lo que afectan: asi se puede
    // marcar como "completada" una reserva de hace una hora.
    if (cambiaCliente) {
      await this.clientesService.findOne(nueva.clienteId);
    }
    if (cambiaHorario) {
      this.validarNoPasada(nueva.fecha, nueva.hora);
    }
    if (cambiaMesa || cambiaPersonas || cambiaHorario) {
      const mesa = await this.mesasService.findOne(nueva.mesaId);
      this.validarCapacidad(mesa, nueva.cantidadPersonas);
      if (cambiaMesa || cambiaHorario) {
        await this.validarHorarioLibre(mesa, nueva.fecha, nueva.hora, id);
      }
    }

    Object.assign(reserva, cambios);
    await this.reservasRepository.save(reserva);
    return this.findOne(id);
  }

  // Borrado logico: la reserva se marca como cancelada, no se elimina.
  async cancelar(id: number) {
    const reserva = await this.reservasRepository.findOneBy({ id });
    if (!reserva) {
      throw new NotFoundException(`No existe la reserva con id ${id}`);
    }
    if (reserva.estado === 'cancelada') {
      throw new BadRequestException('La reserva ya esta cancelada');
    }
    if (reserva.estado === 'completada') {
      throw new BadRequestException(
        'No se puede cancelar una reserva completada',
      );
    }
    reserva.estado = 'cancelada';
    await this.reservasRepository.save(reserva);
    return { mensaje: `Reserva ${id} cancelada` };
  }

  // Mesas activas con capacidad suficiente y sin reservas que se crucen.
  async mesasDisponibles({
    fecha,
    hora,
    personas,
    excluirReservaId,
  }: MesasDisponiblesDto) {
    const mesas = await this.mesasService.findAll();
    const ocupadas = await this.reservasQueSeCruzan(
      fecha,
      hora,
      undefined,
      excluirReservaId,
    );
    const idsOcupadas = new Set(ocupadas.map((reserva) => reserva.mesaId));
    return mesas.filter(
      (mesa) => mesa.capacidad >= personas && !idsOcupadas.has(mesa.id),
    );
  }

  // ------------------------------------------------------------------
  // Reglas de negocio
  // ------------------------------------------------------------------

  // Regla 3: no se reserva en fechas u horas pasadas (hora del servidor).
  private validarNoPasada(fecha: string, hora: string) {
    const inicio = new Date(`${fecha}T${horaCorta(hora)}:00`);
    if (inicio.getTime() <= Date.now()) {
      throw new BadRequestException(
        'No se pueden registrar reservas en fechas u horas pasadas',
      );
    }
  }

  // Regla 2: las personas no pueden superar la capacidad de la mesa.
  private validarCapacidad(mesa: Mesa, cantidadPersonas: number) {
    if (cantidadPersonas > mesa.capacidad) {
      throw new BadRequestException(
        `La mesa ${mesa.numero} admite hasta ${mesa.capacidad} personas`,
      );
    }
  }

  // Regla 1: una mesa no puede tener dos reservas activas que se crucen.
  private async validarHorarioLibre(
    mesa: Mesa,
    fecha: string,
    hora: string,
    excluirReservaId?: number,
  ) {
    const [choque] = await this.reservasQueSeCruzan(
      fecha,
      hora,
      mesa.id,
      excluirReservaId,
    );
    if (choque) {
      throw new ConflictException(
        `La mesa ${mesa.numero} ya esta reservada el ${choque.fecha} a las ` +
          `${horaCorta(choque.hora)} (cada reserva ocupa ${this.bloqueHoras} horas)`,
      );
    }
  }

  // Dos bloques [inicio, inicio + bloque) se cruzan si cada uno empieza
  // antes de que termine el otro. Se compara fecha+hora completas, asi una
  // reserva de las 23:00 tambien bloquea la 01:00 del dia siguiente.
  private reservasQueSeCruzan(
    fecha: string,
    hora: string,
    mesaId?: number,
    excluirReservaId?: number,
  ) {
    const consulta = this.reservasRepository
      .createQueryBuilder('r')
      .where('r.estado <> :cancelada', { cancelada: 'cancelada' })
      .andWhere(
        'TIMESTAMP(r.fecha, r.hora) < TIMESTAMP(:fecha, :hora) + INTERVAL :minutos MINUTE',
      )
      .andWhere(
        'TIMESTAMP(r.fecha, r.hora) + INTERVAL :minutos MINUTE > TIMESTAMP(:fecha, :hora)',
      )
      .setParameters({
        fecha,
        hora: horaCorta(hora),
        minutos: Math.round(this.bloqueHoras * 60),
      });

    if (mesaId !== undefined) {
      consulta.andWhere('r.mesaId = :mesaId', { mesaId });
    }
    if (excluirReservaId !== undefined) {
      consulta.andWhere('r.id <> :excluirReservaId', { excluirReservaId });
    }
    return consulta.getMany();
  }
}

// 'HH:MM:SS' (como viene de MySQL) o 'HH:MM' -> 'HH:MM'
function horaCorta(hora: string) {
  return hora.slice(0, 5);
}
