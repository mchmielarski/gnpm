import { Module, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StorageModule } from '../storage';
import {
  NpmController,
  PackagesController,
  PingController,
  UsersController,
  WhoAmIController
} from './controllers';
import { Package, PackageDistTag, PackageVersion, Token, User } from './entities';
import { UserMiddleware } from './middlewares';
import {
  AttachmentsService,
  FallbackService,
  PackagesService,
  PackagesFallbackService,
  PackagesLocalService,
  PackageDistTagsService,
  PackageVersionsService,
  TokensService,
  UsersService
} from './services';

@Module({
  imports: [TypeOrmModule.forFeature([Package, PackageDistTag, PackageVersion, Token, User])],
  components: [
    AttachmentsService,
    FallbackService,
    PackagesService,
    PackagesFallbackService,
    PackagesLocalService,
    PackageDistTagsService,
    PackageVersionsService,
    TokensService,
    UsersService,
    UserMiddleware
  ],
  controllers: [
    NpmController,
    PackagesController,
    PingController,
    UsersController,
    WhoAmIController
  ]
})
export class RegistryModule {
  configure(consumer: MiddlewaresConsumer): void {
    consumer
      .apply(UserMiddleware)
      .forRoutes(UsersController)
      .apply(UserMiddleware)
      .forRoutes(PackagesController)
      .apply(UserMiddleware)
      .forRoutes(PingController)
      .apply(UserMiddleware)
      .forRoutes(WhoAmIController)
      .apply(UserMiddleware)
      .forRoutes(NpmController);
  }
}
