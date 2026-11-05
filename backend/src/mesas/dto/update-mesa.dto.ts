import { PartialType } from '@nestjs/mapped-types';
import { CreateMesaDto } from './create-mesa.dto.js';

// Mismos campos y validaciones que CreateMesaDto, pero todos opcionales.
export class UpdateMesaDto extends PartialType(CreateMesaDto) {}
