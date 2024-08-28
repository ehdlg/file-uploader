import { UUID } from 'crypto';
import { QueryResult } from 'pg';
import { JwtPayload } from 'jsonwebtoken';
import { VALID_COLUMNS } from './constants';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      validatedData: ValidatedData;
      authData: Auth;
      verifiedToken: VerifiedToken;
    }
  }
}

export interface User {
  id: UUID;
  username: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface Folder {
  id: UUID;
  name: string;
  parent_id: UUID | null;
  user_id: UUID;
  created_at: Date;
}

export interface File {
  id: UUID;
  name: string;
  mimetype: string;
  size: number;
  folder_id: UUID;
  created_at: Date;
}

export type UserData = Omit<User, 'id'> & { userId: UUID; confirmPassword: string };
export type FolderData = Omit<Folder, 'id'> & { folderId: UUID };
export type FileData = Omit<File, 'id'> & { fileId: UUID };

export type ValidatedData = UserData & FolderData & FileData;

export interface IUser extends User, QueryResult {}

export interface IFolder extends Folder, QueryResult {}

export interface IFile extends File, QueryResult {}

export type ValidColumns = (typeof VALID_COLUMNS)[number];

type Auth = Pick<User, 'id' | 'email' | 'username'>;

export type VerifiedToken = JwtPayload & Auth;
