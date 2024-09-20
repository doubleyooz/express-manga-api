import { redirect } from "next/navigation";
import getTitles from "../actions/get-titles";
import TitleHeader, { TitleHeaderProps } from "../header";

export default async function TitlePage({ params }: any) {
  const data: TitleHeaderProps = {
    title: "manga23",

    authorsName: "kamilmysliwiec",
    coverUrl: "https://picsum.photos/400/300",
  };

  const fetchedData = await getTitles({ title: params.id });

  console.log({ fetchedData });
  console.log("here");
  return (
    <div className="flex flex-col  w-full h-full text-white">
      <TitleHeader {...data} />
      <div className="-mt-24 pt-24 bg-gray-900">
        <div className="px-6">
          <p>Post: {params.id}</p>
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
            placerat lacinia diam, ut varius mauris porta malesuada. Etiam eget
            malesuada velit, eu imperdiet lorem. Aliquam erat volutpat. Ut
            vehicula, nulla at dignissim dapibus, purus lacus imperdiet dui, a
            commodo arcu erat in nunc. Sed laoreet consectetur tortor, ac
            posuere urna ultrices at. Quisque vehicula aliquam dictum. Vivamus
            pretium varius tortor, eu fringilla purus. Duis enim turpis,
            bibendum non convallis sit amet, accumsan vitae velit. Duis
            consectetur leo at massa ornare scelerisque. Etiam tempus dolor
            felis, nec semper leo rhoncus sed. Nam molestie tellus eu neque
            luctus tincidunt. Vivamus ut erat eget ligula molestie mollis at
            quis justo. Nulla at risus leo. Nullam tempor nisi non ante
            dignissim hendrerit. Curabitur est magna, dignissim in iaculis in,
            facilisis non ante. Ut nisl tellus, pretium consectetur lectus eu,
            commodo pulvinar quam.{" "}
          </span>
        </div>
      </div>
    </div>
  );
}
