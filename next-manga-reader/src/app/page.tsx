import ChapterUpdate, {
  ChapterUpdateProps,
} from "@/app/chapters/ChapterUpdate";
import LatestChapters from "./chapters/LatestChapters";

export default async function Page() {
  const data: ChapterUpdateProps[] = [
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

  return <LatestChapters title="Latest Updates" chapters={data} />;
}
