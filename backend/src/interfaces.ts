import { UUID } from 'crypto';
import { QueryResult } from 'pg';

export interface IUser extends QueryResult {
  id: UUID;
  username: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface IFolders extends QueryResult {
  id: UUID;
  name: string;
  parent_id: UUID | null;
  user_id: UUID;
  created_at: Date;
}

export interface IFiles extends QueryResult {
  id: UUID;
  name: string;
  mimetype: string;
  size: number;
  folder_id: UUID;
  created_at: Date;
}
