import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMesaDto } from './dto/create-mesa.dto.js';
import { UpdateMesaDto } from './dto/update-mesa.dto.js';
import { Mesa } from './entities/mesa.entity.js';

@Injectable()
export class MesasService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesasRepository: Repository<Mesa>,
  ) {}

  async create(createMesaDto: CreateMesaDto) {
    await this.validarNumeroUnico(createMesaDto.numero);
    const mesa = this.mesasRepository.create(createMesaDto);
    return this.mesasRepository.save(mesa);
  }

  // Solo mesas activas, ordenadas por numero.
  findAll() {
    return this.mesasRepository.find({
      where: { activo: true },
      order: { numero: 'ASC' },
    });
  }

  async findOne(id: number) {
    const mesa = await this.mesasRepository.findOneBy({ id, activo: true });
    if (!mesa) {
      throw new NotFoundException(`No existe la mesa con id ${id}`);
    }
    return mesa;
  }

  async update(id: number, updateMesaDto: UpdateMesaDto) {
    const mesa = await this.findOne(id);
    if (
      updateMesaDto.numero !== undefined &&
      updateMesaDto.numero !== mesa.numero
    ) {
      await this.validarNumeroUnico(updateMesaDto.numero);
    }
    Object.assign(mesa, updateMesaDto);
    return this.mesasRepository.save(mesa);
  }

  // Borrado logico: no se ejecuta DELETE, solo se marca activo = false.
  async remove(id: number) {
    const mesa = await this.findOne(id);
    mesa.activo = false;
    await this.mesasRepository.save(mesa);
    return { mensaje: `Mesa ${mesa.numero} dada de baja` };
  }

  // El numero es UNIQUE en la BD aunque la mesa este dada de baja.
  private async validarNumeroUnico(numero: number) {
    const existente = await this.mesasRepository.findOneBy({ numero });
    if (existente) {
      throw new ConflictException(
        existente.activo
          ? `Ya existe la mesa numero ${numero}`
          : `El numero ${numero} pertenece a una mesa dada de baja`,
      );
    }
  }
}
