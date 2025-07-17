// src/common/pipes/parse-file.pipe.ts
import {
  Injectable,
  PipeTransform,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common';
import { File } from '@nest-lab/fastify-multer';

interface ParseFilePipeOptions {
  required?: boolean; // Whether files are required
  maxSize?: number; // Max file size in bytes
  maxFiles?: number; // Max number of files allowed
  allowedMimeTypes?: string[]; // Allowed MIME types (e.g., ['image/jpeg', 'image/png'])
}

@Injectable()
export class ParseFilePipe implements PipeTransform {
  constructor(private readonly options: ParseFilePipeOptions = {}) {}

  transform(value: File | File[], metadata: ArgumentMetadata): File | File[] {
    const {
      required = true,
      maxSize = 1024 * 1024 * 5, // Default: 5MB
      maxFiles = 4, // Default: 4 files
      allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"], // Default: common image types
    } = this.options;

    // Handle single file or array of files
    const files = Array.isArray(value) ? value : value ? [value] : [];

    // Check if files are required and none are provided
    if (required && files.length === 0) {
      throw new BadRequestException('At least one file is required');
    }

    // If no files are provided and not required, return early
    if (!required && files.length === 0) {
      return [];
    }

    // Check maximum number of files
    if (files.length > maxFiles) {
      throw new BadRequestException(`Maximum ${maxFiles} files allowed`);
    }

    // Validate each file
    for (const file of files) {
      // Check file size
      if (file.size > maxSize) {
        throw new BadRequestException(
          `File ${file.originalname} exceeds maximum size of ${maxSize / (1024 * 1024)}MB`,
        );
      }

      // Check file type
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `File ${file.originalname} has invalid type. Allowed types: ${allowedMimeTypes.join(', ')}`,
        );
      }
    }

    // Return single file or array based on input
    return Array.isArray(value) ? files : files[0];
  }
}