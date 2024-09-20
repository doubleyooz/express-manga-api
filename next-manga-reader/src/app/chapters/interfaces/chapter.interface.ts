import { ITitle } from "@/app/titles/interfaces/title.interface";

export interface IChapter {
  title: string;
  _id: string;
  number: number;
  views: number;
  language: string;
  mangaId: string;
  createdAt: string;
}

export interface IChapterPopulate extends Omit<IChapter, 'mangaId'> {
  mangaId: ITitle;
}


export interface PartialIChapter extends Partial<IChapter> {}
