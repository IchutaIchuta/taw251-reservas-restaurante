import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mesa } from './entities/mesa.entity.js';
import { MesasController } from './mesas.controller.js';
import { MesasService } from './mesas.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Mesa])],
  controllers: [MesasController],
  providers: [MesasService],
  // Se exporta para que ReservasService valide capacidad y existencia.
  exports: [MesasService],
})
export class MesasModule {}
