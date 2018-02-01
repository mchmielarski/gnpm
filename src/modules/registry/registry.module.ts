import { Module, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StorageModule } from '../storage';
import {
  NpmController,
  OrgMembersController,
  OrgsController,
  PackagesController,
  PingController,
  TeamsController,
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
import { UserMiddleware, OrgMiddleware, TeamMiddleware } from './middlewares';
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
  TeamsService,
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
    TeamMiddleware,
    TeamsService,
    TokensService,
    UsersService,
    UserMiddleware
  ],
  controllers: [
    NpmController,
    OrgMembersController,
    OrgsController,
    PackagesController,
    PingController,
    TeamsController,
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
      OrgMembersController,
      OrgsController,
      TeamsController
    ]);

    applyMiddlewareToControllers(consumer, OrgMiddleware, [OrgMembersController, TeamsController]);
    applyMiddlewareToControllers(consumer, TeamMiddleware, [TeamsController]);
  }
}
