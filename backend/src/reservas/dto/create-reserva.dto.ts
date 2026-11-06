import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

// Formatos compartidos con los demas DTOs de reservas.
export const PATRON_FECHA = /^\d{4}-\d{2}-\d{2}$/;
export const PATRON_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
export const MENSAJE_FECHA = 'La fecha debe tener el formato AAAA-MM-DD';
export const MENSAJE_HORA = 'La hora debe tener el formato HH:MM (24 horas)';

// Las reglas de negocio (capacidad, horario ocupado, fecha pasada) se
// validan en ReservasService porque necesitan consultar la BD.
export class CreateReservaDto {
  @IsInt({ message: 'El cliente es obligatorio' })
  @Min(1, { message: 'El cliente no es valido' })
  clienteId: number;

  @IsInt({ message: 'La mesa es obligatoria' })
  @Min(1, { message: 'La mesa no es valida' })
  mesaId: number;

  @Matches(PATRON_FECHA, { message: MENSAJE_FECHA })
  @IsDateString({ strict: true }, { message: 'La fecha no es valida' })
  fecha: string;

  @Matches(PATRON_HORA, { message: MENSAJE_HORA })
  hora: string;

  @IsInt({ message: 'La cantidad de personas debe ser un entero' })
  @Min(1, { message: 'La reserva debe ser al menos para 1 persona' })
  @Max(20, { message: 'La reserva no puede superar 20 personas' })
  cantidadPersonas: number;

  // Opcional. Un texto vacio se guarda como NULL.
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return value;
    const limpio = value.trim();
    return limpio === '' ? null : limpio;
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser texto' })
  @MaxLength(255, { message: 'Las observaciones admiten hasta 255 caracteres' })
  observaciones?: string | null;
}
