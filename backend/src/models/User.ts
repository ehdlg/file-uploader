import Base from './Base';
import { TABLES } from '../constants';
import { IUser } from '../interfaces';

export class User extends Base<IUser> {
  constructor() {
    super(TABLES.USERS);
  }
}
