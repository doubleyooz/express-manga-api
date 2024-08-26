import ChapterUpdate, { ChapterUpdateProps } from "@/app/chapters/ChapterUpdate";
import LatestChapters from "./chapters/LatestChapters";

export default async function Home() {

  const data: ChapterUpdateProps[] = [
    {
      chapterNumber: 22,
      chapterTitle: 'dasdas',
      date: '22/12/2005',
      mangaTitle: 'Ninja Chronicles',
      scanName: 'Yandere',
      coverUrl: 'https://via.assets.so/img.jpg?w=400&h=400&tc=blue&bg=#cecece',


    },
    {
      chapterNumber: 22,
      chapterTitle: 'dasdas',
      date: '22/12/2005',
      mangaTitle: 'Ninja Chronicles',
      scanName: 'Yandere',
      coverUrl: 'https://via.assets.so/img.jpg?w=400&h=400&tc=blue&bg=#cecece',


    },
    {
      chapterNumber: 22,
      chapterTitle: 'dasdas',
      date: '22/12/2005',
      mangaTitle: 'Ninja Chronicles',
      scanName: 'Yandere',
      coverUrl: 'https://via.assets.so/img.jpg?w=400&h=400&tc=blue&bg=#cecece',


    },
    {
      chapterNumber: 22,
      chapterTitle: 'dasdas',
      date: '22/12/2005',
      mangaTitle: 'Ninja Chronicles',
      scanName: 'Yandere',
      coverUrl: 'https://via.assets.so/img.jpg?w=400&h=400&tc=blue&bg=#cecece',


    },
    {
      chapterNumber: 22,
      chapterTitle: 'dasdas',
      date: '22/12/2005',
      mangaTitle: 'Ninja Chronicles',
      scanName: 'Yandere',
      coverUrl: 'https://via.assets.so/img.jpg?w=400&h=400&tc=blue&bg=#cecece',


    },
    {
      chapterNumber: 22,
      chapterTitle: 'dasdas',
      date: '22/12/2005',
      mangaTitle: 'Ninja Chronicles',
      scanName: 'Yandere',
      coverUrl: 'https://via.assets.so/img.jpg?w=400&h=400&tc=blue&bg=#cecece',


    },
  ]

  return (
    <LatestChapters title='Latest Updates' chapters={data} />


  );
}
