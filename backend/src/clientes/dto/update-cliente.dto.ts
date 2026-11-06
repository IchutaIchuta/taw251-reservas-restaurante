import { PartialType } from '@nestjs/mapped-types';
import { CreateClienteDto } from './create-cliente.dto.js';

// Mismos campos y validaciones que CreateClienteDto, pero todos opcionales.
export class UpdateClienteDto extends PartialType(CreateClienteDto) {}
