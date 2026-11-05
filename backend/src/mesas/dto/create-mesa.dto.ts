import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMesaDto {
  @IsInt({ message: 'El numero de mesa debe ser un entero' })
  @Min(1, { message: 'El numero de mesa debe ser mayor a 0' })
  numero: number;

  @IsInt({ message: 'La capacidad debe ser un entero' })
  @Min(1, { message: 'La capacidad debe ser al menos 1 persona' })
  @Max(20, { message: 'La capacidad no puede superar 20 personas' })
  capacidad: number;

  @IsString({ message: 'La ubicacion debe ser texto' })
  @IsNotEmpty({ message: 'La ubicacion es obligatoria' })
  @MaxLength(100, { message: 'La ubicacion admite hasta 100 caracteres' })
  ubicacion: string;
}
