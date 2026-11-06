import { IsDateString, IsIn, IsOptional, Matches } from 'class-validator';
import { ESTADOS_RESERVA } from '../entities/reserva.entity.js';
import type { EstadoReserva } from '../entities/reserva.entity.js';
import { MENSAJE_FECHA, PATRON_FECHA } from './create-reserva.dto.js';

// Filtros de GET /reservas?fecha=2026-11-20&estado=pendiente
export class FiltroReservasDto {
  @IsOptional()
  @Matches(PATRON_FECHA, { message: MENSAJE_FECHA })
  @IsDateString({ strict: true }, { message: 'La fecha no es valida' })
  fecha?: string;

  // Sin estado se listan todas menos las canceladas.
  @IsOptional()
  @IsIn(ESTADOS_RESERVA, {
    message: `El estado debe ser uno de: ${ESTADOS_RESERVA.join(', ')}`,
  })
  estado?: EstadoReserva;
}
