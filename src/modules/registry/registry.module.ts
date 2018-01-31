import { Module, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StorageModule } from '../storage';
import {
  NpmController,
  OrgMembersController,
  PackagesController,
  PingController,
  UsersController,
  WhoAmIController
} from './controllers';
import {
  OrgMember,
  Org,
  Package,
  PackageDistTag,
  PackageVersion,
  Team,
  TeamMember,
  Token,
  User
} from './entities';
import { UserMiddleware, OrgMiddleware } from './middlewares';
import {
  AttachmentsService,
  FallbackService,
  OrgsService,
  OrgMembersService,
  PackagesService,
  PackagesFallbackService,
  PackagesLocalService,
  PackageDistTagsService,
  PackageVersionsService,
  TokensService,
  UsersService
} from './services';
import { applyMiddlewareToControllers } from './util';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrgMember,
      Org,
      Package,
      PackageDistTag,
      PackageVersion,
      Team,
      TeamMember,
      Token,
      User
    ])
  ],
  components: [
    AttachmentsService,
    FallbackService,
    OrgsService,
    OrgMembersService,
    OrgMiddleware,
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
    OrgMembersController,
    PackagesController,
    PingController,
    UsersController,
    WhoAmIController
  ]
})
export class RegistryModule {
  configure(consumer: MiddlewaresConsumer): void {
    applyMiddlewareToControllers(consumer, UserMiddleware, [
      UsersController,
      PackagesController,
      PingController,
      WhoAmIController,
      NpmController,
      OrgMembersController
    ]);

    applyMiddlewareToControllers(consumer, OrgMiddleware, [OrgMembersController]);
  }
}
