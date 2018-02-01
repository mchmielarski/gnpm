import { Guard, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { _ } from '../../common';
import { REQUIRED_PERMISSIONS_METADATA_KEY } from '../constants';
import { User, Org } from '../entities';
import { UnauthorizedException } from '../exceptions';
import { getUser, getOrg } from '../util';
import { Permission } from '../enums';
import { OrgMembersService } from '../services';

const getUserName = _.compose<any, any, string | null>(_.defaultTo(null), _.path(['user', 'name']));
const getOrgName = _.compose<any, any, string | null>(_.defaultTo(null), _.path(['org', 'name']));

@Guard()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly orgMembersService: OrgMembersService
  ) {}

  async canActivate(request, context: ExecutionContext) {
    const { parent, handler } = context;
    const requiredPermissions = this.reflector.get<Permission[]>(
      REQUIRED_PERMISSIONS_METADATA_KEY,
      handler
    );
    const user = getUser(request);
    const org = getOrg(request);

    if (!requiredPermissions) {
      return true;
    }

    if (requiredPermissions && !user) {
      throw new UnauthorizedException();
    }
    let hasPermissions = true;

    for (const requiredPermission of requiredPermissions) {
      hasPermissions = await this.hasPermission(requiredPermission, { user, org });
    }

    if (!hasPermissions) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private async hasPermission(
    permission: Permission,
    params: { user: User | null; org: Org | null }
  ) {
    switch (permission) {
      case Permission.ORG_OWNER:
      case Permission.ORG_ADMIN:
      case Permission.ORG_MEMBER: {
        return this.hasOrgPermission(permission, params);
      }

      case Permission.USER: {
        return !!getUserName(params);
      }

      default: {
        return false;
      }
    }
  }

  private async hasOrgPermission(
    permission: Permission,
    params: { user: User | null; org: Org | null }
  ) {
    const orgName = getOrgName(params);
    const userName = getUserName(params);

    if (!orgName || !userName) {
      return false;
    }

    switch (permission) {
      case Permission.ORG_MEMBER: {
        return this.orgMembersService.isMember(orgName, userName);
      }

      case Permission.ORG_ADMIN: {
        return (
          (await this.orgMembersService.isAdmin(orgName, userName)) ||
          (await this.orgMembersService.isOwner(orgName, userName))
        );
      }

      case Permission.ORG_OWNER: {
        return this.orgMembersService.isOwner(orgName, userName);
      }

      default: {
        return false;
      }
    }
  }
}
