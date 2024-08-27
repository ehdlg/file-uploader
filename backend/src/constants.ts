export const TABLES = {
  USERS: 'users',
  FILES: 'files',
  FOLDERS: 'folders',
};

export const VALID_COLUMNS = [
  'username',
  'email',
  'id',
  'name',
  'parent_id',
  'folder_id',
  'mime_type',
  'url',
  'size',
] as const;

export const PASSWORD_REGEXP =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const ROOT_FOLDER_NAME = 'root';

export const SALT = 10;
