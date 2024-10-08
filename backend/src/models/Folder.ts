import Base from './Base';
import { TABLES, ROOT_FOLDER_NAME } from '../constants';
import { UUID } from 'crypto';
import { IFolder } from '../interfaces';

export class Folder extends Base<IFolder> {
  constructor() {
    super(TABLES.FOLDERS);
  }

  async findAllByUser(userId: UUID) {
    const sql = 'SELECT * FROM folders WHERE user_id = $1';

    const { rows } = await this.query<IFolder>(sql, [userId]);

    return rows;
  }

  async findByUserId(folderId: UUID, userId: UUID) {
    const sql = 'SELECT * FROM folders WHERE id = $1 AND user_id = $2';
    const { rows } = await this.query<IFolder>(sql, [folderId, userId]);

    return rows[0] || null;
  }

  async findSubfolders(folderId: UUID) {
    const sql = 'SELECT * FROM folders WHERE parent_id = $1';

    const { rows } = await this.query<IFolder>(sql, [folderId]);

    return rows;
  }

  async findByNameParentAndUser(folderName: string, userId: UUID, parentId: UUID | null) {
    const sql = `
     SELECT * FROM folders 
     WHERE name = $1 AND user_id = $2 
     AND (${parentId === null ? 'parent_id IS NULL' : 'parent_id = $3'})
   `;
    const params = parentId === null ? [folderName, userId] : [folderName, userId, parentId];

    const { rows } = await this.query<IFolder>(sql, params);

    return rows[0] || null;
  }

  async findRootId(userId: UUID) {
    const sql = 'SELECT id FROM folders WHERE name = $1 AND user_id = $2 and parent_id IS NULL';

    const { rows } = await this.query<IFolder>(sql, [ROOT_FOLDER_NAME, userId]);

    return rows[0] || null;
  }
}
