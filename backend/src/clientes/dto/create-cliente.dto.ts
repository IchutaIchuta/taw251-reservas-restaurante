import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

// Quita espacios al inicio y al final de los textos.
const recortar = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateClienteDto {
  @Transform(recortar)
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre admite hasta 100 caracteres' })
  nombre: string;

  @Transform(recortar)
  @IsString({ message: 'El telefono debe ser texto' })
  @Matches(/^\+?[0-9 -]{7,20}$/, {
    message:
      'El telefono debe tener entre 7 y 20 caracteres: digitos, espacios, guiones y un + inicial',
  })
  telefono: string;

  // Opcional: se puede omitir o enviar null (para borrarlo al editar).
  // Un texto vacio se toma como null.
  @Transform(({ value }: { value: unknown }) => {
    const limpio = recortar({ value });
    return limpio === '' ? null : limpio;
  })
  @IsOptional()
  @IsEmail({}, { message: 'El email no tiene un formato valido' })
  @MaxLength(150, { message: 'El email admite hasta 150 caracteres' })
  email?: string | null;
}
