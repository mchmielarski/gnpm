import { UserCreateDTO } from './user-create.dto';
import { UserLoginDTO } from './user-login.dto';

export type UserLoginOrCreateDTO = UserCreateDTO | UserLoginDTO;
