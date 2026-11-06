import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Mapea la tabla "clientes" creada en database/schema.sql.
@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  // Opcional: NULL en la BD si no se registra.
  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  // Borrado logico: false = dado de baja. TINYINT(1) en MySQL.
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
