import Base from './Base';
import { TABLES } from '../constants';
import { IFile } from '../interfaces';
import { UUID } from 'crypto';

export class File extends Base<IFile> {
  constructor() {
    super(TABLES.FILES);
  }

  async findAllByFolder(folderId: UUID, userId: UUID) {
    const sql = `SELECT 
                fi.id, fi.name, fi.mimetype, fi.url, fi.size, fi.folder_id, fi.created_at
                FROM files fi
                JOIN folders fo ON fi.folder_id = fo.id
                WHERE fi.folder_id = $1 AND fo.user_id = $2;`;

    const { rows } = await this.query<IFile>(sql, [folderId, userId]);

    return rows;
  }

  async findByFolder(fileId: UUID, folderId: UUID) {
    const sql = 'SELECT * FROM files WHERE id = $1 and folder_id = $2';

    const { rows } = await this.query<IFile>(sql, [fileId, folderId]);

    return rows[0] || null;
  }

  async findByNameAndFolder(name: string, folderId: UUID) {
    const sql = 'SELECT * FROM files WHERE name = $1 AND folder_id = $2';

    const { rows } = await this.query<IFile>(sql, [name, folderId]);

    return rows[0] || null;
  }
}
