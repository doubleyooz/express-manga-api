// src/storage/s3-storage.service.ts
import { Injectable } from '@nestjs/common';
import { FileStorage } from '../interfaces/storage.interface';
import { File } from '@nest-lab/fastify-multer';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3StorageService implements FileStorage {
  private s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_REGION'),
    });
  }
  deleteFiles(filesArray: Array<File>): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async uploadFiles(files: Array<File>, destination: string): Promise<string[]> {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET');
    const fileUrls: string[] = [];

    for (const file of files) {
      const params = {
        Bucket: bucket,
        Key: `${destination}/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', // Adjust based on your needs
      };

      const { Location } = await this.s3.upload(params).promise();
      fileUrls.push(Location);
    }

    return fileUrls;
  }
}