import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateReservaDto } from './dto/create-reserva.dto.js';
import { FiltroReservasDto } from './dto/filtro-reservas.dto.js';
import { MesasDisponiblesDto } from './dto/mesas-disponibles.dto.js';
import { UpdateReservaDto } from './dto/update-reserva.dto.js';
import { ReservasService } from './reservas.service.js';

// Rutas: /reservas. Los guards por rol se agregan en la Fase 2 (JWT).
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  create(@Body() createReservaDto: CreateReservaDto) {
    return this.reservasService.create(createReservaDto);
  }

  // GET /reservas?fecha=2026-11-20&estado=pendiente (ambos opcionales)
  @Get()
  findAll(@Query() filtro: FiltroReservasDto) {
    return this.reservasService.findAll(filtro);
  }

  // Debe ir antes de ':id' para que "mesas-disponibles" no se tome como id.
  @Get('mesas-disponibles')
  mesasDisponibles(@Query() consulta: MesasDisponiblesDto) {
    return this.reservasService.mesasDisponibles(consulta);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReservaDto: UpdateReservaDto,
  ) {
    return this.reservasService.update(id, updateReservaDto);
  }

  // DELETE cancela la reserva (borrado logico, estado = 'cancelada').
  @Delete(':id')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.reservasService.cancelar(id);
  }
}
