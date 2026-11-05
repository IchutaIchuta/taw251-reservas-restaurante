import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// Mapea la tabla "mesas" creada en database/schema.sql.
@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unique: true })
  numero: number;

  @Column({ type: 'int' })
  capacidad: number;

  @Column({ type: 'varchar', length: 100 })
  ubicacion: string;

  // Borrado logico: false = dada de baja. TINYINT(1) en MySQL.
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
