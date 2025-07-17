import { File } from "@nest-lab/fastify-multer";

export interface ImageInterface extends File{
  size: number;
  filename: string;
  destination: string;
  mimetype: string;
}
