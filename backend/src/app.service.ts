import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  async estado() {
    const [{ total }] = await this.dataSource.query(
      'SELECT COUNT(*) AS total FROM mesas',
    );
    return {
      sistema: 'Sistema de Reservas Online para Restaurante',
      baseDatos: this.dataSource.isInitialized ? 'conectada' : 'desconectada',
      mesas: Number(total),
    };
  }
}
