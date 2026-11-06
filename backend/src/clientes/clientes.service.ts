import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateClienteDto } from './dto/create-cliente.dto.js';
import { UpdateClienteDto } from './dto/update-cliente.dto.js';
import { Cliente } from './entities/cliente.entity.js';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clientesRepository: Repository<Cliente>,
  ) {}

  create(createClienteDto: CreateClienteDto) {
    const cliente = this.clientesRepository.create(createClienteDto);
    return this.clientesRepository.save(cliente);
  }

  // Solo clientes activos, por nombre. "buscar" filtra por nombre o telefono.
  findAll(buscar?: string) {
    const texto = buscar?.trim();
    const where = texto
      ? [
          { activo: true, nombre: Like(`%${texto}%`) },
          { activo: true, telefono: Like(`%${texto}%`) },
        ]
      : { activo: true };

    return this.clientesRepository.find({ where, order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const cliente = await this.clientesRepository.findOneBy({
      id,
      activo: true,
    });
    if (!cliente) {
      throw new NotFoundException(`No existe el cliente con id ${id}`);
    }
    return cliente;
  }

  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOne(id);
    Object.assign(cliente, updateClienteDto);
    return this.clientesRepository.save(cliente);
  }

  // Borrado logico: no se ejecuta DELETE, solo se marca activo = false.
  // Sus reservas anteriores siguen existiendo en la BD.
  async remove(id: number) {
    const cliente = await this.findOne(id);
    cliente.activo = false;
    await this.clientesRepository.save(cliente);
    return { mensaje: `Cliente ${cliente.nombre} dado de baja` };
  }
}
