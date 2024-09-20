export interface ITitle {
  title: string;
  synopsis: string;
  coverImage: string[];
  nsfw: boolean;
  rating: number;
  _id: string;
  type: string;
  genres: string[];
}

export interface PartialITitle extends Partial<ITitle> {}
