import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateMesaDto } from './dto/create-mesa.dto.js';
import { UpdateMesaDto } from './dto/update-mesa.dto.js';
import { MesasService } from './mesas.service.js';

// Rutas: /mesas. Los guards por rol se agregan en la Fase 2 (JWT).
@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  create(@Body() createMesaDto: CreateMesaDto) {
    return this.mesasService.create(createMesaDto);
  }

  @Get()
  findAll() {
    return this.mesasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mesasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMesaDto: UpdateMesaDto,
  ) {
    return this.mesasService.update(id, updateMesaDto);
  }

  // DELETE hace borrado logico (activo = false), ver MesasService.remove.
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.mesasService.remove(id);
  }
}
