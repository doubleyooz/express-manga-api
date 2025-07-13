import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class ImageSchema {
  @Prop()
  destination: string;

  @Prop()
  filename: string;

  @Prop()
  size: number;

  @Prop()
  mimetype: string;
}
