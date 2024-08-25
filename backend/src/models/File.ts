import Base from './Base';
import { TABLES } from '../constants';
import { IFile } from '../interfaces';

export class File extends Base<IFile> {
  constructor() {
    super(TABLES.FILES);
  }
}
