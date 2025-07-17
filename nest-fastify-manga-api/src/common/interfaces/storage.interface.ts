import { File } from '@nest-lab/fastify-multer';

export interface FileStorage {
  uploadFiles(files: Array<File>, destination: string): Promise<string[]>;
  deleteFiles(filesArray: Array<File>): Promise<void>
}