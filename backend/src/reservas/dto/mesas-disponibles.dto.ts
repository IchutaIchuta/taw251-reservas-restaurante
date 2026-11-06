import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Matches, Min } from 'class-validator';
import {
  MENSAJE_FECHA,
  MENSAJE_HORA,
  PATRON_FECHA,
  PATRON_HORA,
} from './create-reserva.dto.js';

// GET /reservas/mesas-disponibles?fecha=2026-11-20&hora=19:00&personas=4
// Los parametros de la URL llegan como texto; @Type los convierte a numero.
export class MesasDisponiblesDto {
  @Matches(PATRON_FECHA, { message: MENSAJE_FECHA })
  @IsDateString({ strict: true }, { message: 'La fecha no es valida' })
  fecha: string;

  @Matches(PATRON_HORA, { message: MENSAJE_HORA })
  hora: string;

  @Type(() => Number)
  @IsInt({ message: 'La cantidad de personas debe ser un entero' })
  @Min(1, { message: 'La cantidad de personas debe ser al menos 1' })
  personas: number;

  // Al editar: no contar la propia reserva como ocupada.
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'excluirReservaId debe ser un entero' })
  excluirReservaId?: number;
}
