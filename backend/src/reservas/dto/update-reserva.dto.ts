import { PartialType } from '@nestjs/mapped-types';
import { IsIn, IsOptional } from 'class-validator';
import { CreateReservaDto } from './create-reserva.dto.js';

// Estados que se pueden poner al editar. Para cancelar se usa
// DELETE /reservas/:id (borrado logico).
export const ESTADOS_EDITABLES = ['pendiente', 'confirmada', 'completada'] as const;

export class UpdateReservaDto extends PartialType(CreateReservaDto) {
  @IsOptional()
  @IsIn(ESTADOS_EDITABLES, {
    message:
      'El estado debe ser pendiente, confirmada o completada (para cancelar use DELETE)',
  })
  estado?: (typeof ESTADOS_EDITABLES)[number];
}
