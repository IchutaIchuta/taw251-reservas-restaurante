import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity.js';
import { Mesa } from '../../mesas/entities/mesa.entity.js';

export const ESTADOS_RESERVA = [
  'pendiente',
  'confirmada',
  'cancelada',
  'completada',
] as const;

export type EstadoReserva = (typeof ESTADOS_RESERVA)[number];

// Mapea la tabla "reservas" creada en database/schema.sql.
@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  // Se guarda el id (cliente_id) y ademas la relacion para leer los datos
  // del cliente con relations: { cliente: true }.
  @Column({ name: 'cliente_id', type: 'int' })
  clienteId: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ name: 'mesa_id', type: 'int' })
  mesaId: number;

  @ManyToOne(() => Mesa)
  @JoinColumn({ name: 'mesa_id' })
  mesa: Mesa;

  // DATE -> TypeORM lo devuelve como texto 'AAAA-MM-DD'.
  @Column({ type: 'date' })
  fecha: string;

  // TIME -> texto 'HH:MM:SS'.
  @Column({ type: 'time' })
  hora: string;

  @Column({ name: 'cantidad_personas', type: 'int' })
  cantidadPersonas: number;

  // Cancelar una reserva es su borrado logico (estado = 'cancelada').
  @Column({ type: 'enum', enum: ESTADOS_RESERVA, default: 'pendiente' })
  estado: EstadoReserva;

  @Column({ type: 'varchar', length: 255, nullable: true })
  observaciones: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
