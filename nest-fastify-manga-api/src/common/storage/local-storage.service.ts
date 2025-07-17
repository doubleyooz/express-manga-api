// src/storage/local-storage.service.ts
import { Injectable } from '@nestjs/common';
import { unlink } from "node:fs/promises";
import { File } from '@nest-lab/fastify-multer';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { ConfigService } from '@nestjs/config';
import { FileStorage } from '../interfaces/storage.interface';

@Injectable()
export class LocalStorageService implements FileStorage {
  constructor(private readonly configService: ConfigService) {}

  async uploadFiles(files: Array<File>, destination: string): Promise<string[]> {
    const uploadPath = this.configService.get<string>('UPLOAD_PATH', 'uploads');
    const fileUrls: string[] = [];

    for (const file of files) {
      const filePath = join(uploadPath, destination, file.originalname);
      await writeFile(filePath, file.buffer);
      fileUrls.push(filePath);
    }

    return fileUrls;
  }
  
  async deleteFiles(filesArray: Array<File>) {
    const errors = [];
  
    // Map each file deletion attempt to a promise
    const deletionPromises = filesArray.map(async (fileObj) => {
      try {
        await unlink(fileObj.destination + fileObj.filename);
        console.log(`Successfully deleted ${fileObj.filename}`);
      }
      catch (error) {
        // Collect errors instead of throwing them immediately
        errors.push({ filename: fileObj.filename, error });
      }
    });
  
    // Wait for all deletion attempts to complete
    await Promise.all(deletionPromises);
  
    // Report errors after all deletions have been attempted
    if (errors.length > 0) {
      console.error("Errors occurred during deletion:");
      errors.forEach(({ filename, error }) => {
        console.error(`Failed to delete ${filename}:`, error.message);
      });
    }
  }
  
}