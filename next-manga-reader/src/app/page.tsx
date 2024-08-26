import ChapterUpdate, { ChapterUpdateProps } from "@/components/ChapterUpdate";

export default async function Home() {

  const data : ChapterUpdateProps[] = [
    {
      chapterNumber: 22,
      chapterTitle: 'dasdas',
      date: '22/12/2005',
      mangaTitle: 'Ninja Chronicles',
      scanName: 'Yandere',
      coverUrl: 'https://via.assets.so/img.jpg?w=400&h=400&tc=blue&bg=#cecece',
     

    }
  ]

  return (
   
      <div className="flex flex-col mt-4">
        {
          data.map((item, index) => (
            <ChapterUpdate key={index} {...item} />
          ))
        }
      
      </div>
  
  );
}
