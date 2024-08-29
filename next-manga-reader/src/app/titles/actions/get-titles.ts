"use server";

import { get } from "@/common/utils/axios";
import { ITitle, PartialITitle } from "../interfaces/title.interface";

export default async function getTitles(props?: PartialITitle) {
  const data = await get<ITitle[]>("mangas", props);
  console.log(data);
  return data;
}
