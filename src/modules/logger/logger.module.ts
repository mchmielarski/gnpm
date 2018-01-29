import { DynamicModule, Global, Module } from '@nestjs/common';

import { LoggerService } from './services/logger.service';
import { RawAdapter } from './adapters/raw.adapter';

@Global()
@Module({
  components: [LoggerService],
  exports: [LoggerService]
})
export class LoggerModule {
  static forRoot(adapters: RawAdapter[]): DynamicModule {
    return {
      module: LoggerModule,
      components: [
        {
          provide: 'ADAPTERS',
          useValue: adapters
        }
      ]
    };
  }
}
