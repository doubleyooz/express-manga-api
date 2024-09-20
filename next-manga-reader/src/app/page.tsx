import ChapterUpdate, {
  ChapterUpdateProps,
} from "@/app/chapters/ChapterUpdate";
import LatestChapters from "./chapters/LatestChapters";
import getChapters from "./chapters/actions/get-chapters";
import { IChapterPopulate } from "./chapters/interfaces/chapter.interface";

export default async function Page() {
  const data3: ChapterUpdateProps[] = [
    {
      chapterNumber: 22,
      chapterTitle: "dasdas",
      date: "22/12/2005",
      mangaTitle: "Ninja Chronicles",
      scanName: "Yandere",
      coverUrl: "https://picsum.photos/400/300",
    },
    {
      chapterNumber: 22,
      chapterTitle: "dasdas",
      date: "22/12/2005",
      mangaTitle: "Ninja Chronicles",
      scanName: "Yandere",
      coverUrl: "https://picsum.photos/400/300",
    },
    {
      chapterNumber: 22,
      chapterTitle: "dasdas",
      date: "22/12/2005",
      mangaTitle: "Ninja Chronicles",
      scanName: "Yandere",
      coverUrl: "https://picsum.photos/400/300",
    },
    {
      chapterNumber: 22,
      chapterTitle: "dasdas",
      date: "22/12/2005",
      mangaTitle: "Ninja Chronicles",
      scanName: "Yandere",
      coverUrl: "https://picsum.photos/400/300",
    },
    {
      chapterNumber: 22,
      chapterTitle: "dasdas",
      date: "22/12/2005",
      mangaTitle: "Ninja Chronicles",
      scanName: "Yandere",
      coverUrl: "https://picsum.photos/400/300",
    },
    {
      chapterNumber: 22,
      chapterTitle: "dasdas",
      date: "22/12/2005",
      mangaTitle: "Ninja Chronicles",
      scanName: "Yandere",
      coverUrl: "https://picsum.photos/400/300",
    },
  ];
  const fetchedData = await getChapters<IChapterPopulate>({}, "/", true);
  console.log({ fetchedData: fetchedData?.data, manga: fetchedData?.data.map((manga) => manga.mangaId) });
  const data: ChapterUpdateProps[] = (fetchedData?.data || []).map(
    (chapter) => ({
      mangaTitle: chapter.mangaId.title,
      chapterTitle: chapter.title,
      chapterNumber: chapter.number,
      coverUrl: chapter.mangaId.coverImage[0],
      date: chapter.createdAt,
      scanName: "Yandere",
      volume: '31',
      // scanName: string;
      // date: string;
    })
  );
  console.log({ data });
  return <LatestChapters title="Latest Updates" chapters={data} />;
}
