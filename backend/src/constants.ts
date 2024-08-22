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
