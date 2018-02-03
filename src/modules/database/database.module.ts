import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from '../config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...config.getDatabaseOptions(),
      entities: [__dirname + '/../**/*.entity.{ts,js}']
    })
  ]
})
export class DatabaseModule {}
