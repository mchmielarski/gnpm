import { Module, DynamicModule, Global } from '@nestjs/common';

import {
  BaseAdapter,
  LocalAdapter,
  LocalAdapterOptions,
  GoogleStorageAdapter,
  GoogleStorageAdapterOptions
} from './adapters';
import { StorageType } from './enums/type.enum';
import { StorageService } from './services';

@Global()
@Module({})
export class StorageModule {
  static forRoot(
    type: StorageType,
    options: LocalAdapterOptions | GoogleStorageAdapterOptions
  ): DynamicModule {
    return {
      module: StorageModule,
      exports: [StorageService],
      components: [
        {
          provide: StorageService,
          useFactory: () => {
            let adapter: BaseAdapter;

            switch (type) {
              case StorageType.GOOGLE_STORAGE:
                adapter = new GoogleStorageAdapter(options as GoogleStorageAdapterOptions);
                break;
              default:
                adapter = new LocalAdapter(options as LocalAdapterOptions);
            }

            return new StorageService(adapter);
          }
        }
      ]
    };
  }
}
