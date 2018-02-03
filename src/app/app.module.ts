import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { join } from 'path';

import { DatabaseModule } from '../modules/database';
import { LoggerModule, ConsoleAdapter, LogLevel, HttpLoggerMiddleware } from '../modules/logger';
import { RegistryModule } from '../modules/registry';
import {
  FaviconMiddleware,
  RequestIdMiddleware,
  ResponseTimeMiddleware
} from '../modules/middlewares';
import { StorageModule, StorageType } from '../modules/storage';
import { config } from '../modules/config';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule.forRoot([new ConsoleAdapter(config.isDevEnv() ? LogLevel.INFO : LogLevel.ERROR)]),
    RegistryModule,
    StorageModule.forRoot(config.getStorageType(), config.getStorageOptions())
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewaresConsumer) {
    consumer
      .apply([FaviconMiddleware, RequestIdMiddleware, ResponseTimeMiddleware, HttpLoggerMiddleware])
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL
      });
  }
}
