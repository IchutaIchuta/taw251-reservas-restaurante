import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesModule } from '../clientes/clientes.module.js';
import { MesasModule } from '../mesas/mesas.module.js';
import { Reserva } from './entities/reserva.entity.js';
import { ReservasController } from './reservas.controller.js';
import { ReservasService } from './reservas.service.js';

@Module({
  // MesasModule y ClientesModule exportan sus servicios para validar
  // que la mesa y el cliente existan.
  imports: [TypeOrmModule.forFeature([Reserva]), MesasModule, ClientesModule],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservasModule {}
