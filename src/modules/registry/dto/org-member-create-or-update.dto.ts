import { Role } from '../enums';

export interface OrgMemberCreateOrUpdateDTO {
  user: string;
  role: Role;
}
