import { Injectable } from '@nestjs/common';
import { User } from '../database/entities';

@Injectable()
export class UserTransformer {
  public transform(user: User | any): any {
    return {
      ...user,
      password: undefined,
    };
  }
}
