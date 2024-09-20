"use server";

import { get } from "@/common/utils/axios";
import { ITitle, PartialITitle } from "../interfaces/title.interface";
import { redirect } from "next/navigation";

export default async function getTitles(props?: PartialITitle, to = "/") {
  try {
    return await get<ITitle[]>("mangas", props);
  } catch (err) {
    console.log(err);
    redirect(to);
  }
}
