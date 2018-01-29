import { Module, DynamicModule, Global } from '@nestjs/common';

import { LocalAdapter, LocalAdapterOptions } from './adapters';
import { StorageType } from './enums/type.enum';
import { StorageService } from './services';

@Global()
@Module({})
export class StorageModule {
  static forRoot(type: StorageType, options: LocalAdapterOptions): DynamicModule {
    return {
      module: StorageModule,
      exports: [StorageService],
      components: [
        {
          provide: StorageService,
          useFactory: () => {
            return new StorageService(new LocalAdapter(options));
          }
        }
      ]
    };
  }
}
