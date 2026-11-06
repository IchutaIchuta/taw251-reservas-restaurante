import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientesController } from './clientes.controller.js';
import { ClientesService } from './clientes.service.js';
import { Cliente } from './entities/cliente.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente])],
  controllers: [ClientesController],
  providers: [ClientesService],
  // Se exporta para que ReservasService valide que el cliente exista.
  exports: [ClientesService],
})
export class ClientesModule {}
