import Base from './Base';
import { TABLES } from '../constants';
import { IUser } from '../interfaces';

export class User extends Base<IUser> {
  constructor() {
    super(TABLES.USERS);
  }

  async getByCredentials(email: string): Promise<IUser | null> {
    const { rows } = await this.query<IUser>('SELECT * FROM users WHERE email = $1', [email]);

    return rows[0] || null;
  }

  async getByUsername(username: string): Promise<IUser | null> {
    const { rows } = await this.query<IUser>('SELECT * FROM users WHERE username = $1', [username]);

    return rows[0] || null;
  }
}
