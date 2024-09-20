"use server";

import { get } from "@/common/utils/axios";
import { IChapter, IChapterPopulate, PartialIChapter } from "../interfaces/chapter.interface";
import { redirect } from "next/navigation";
import { ITitle } from "@/app/titles/interfaces/title.interface";

export default async function getChapters<T>(
  props?: PartialIChapter,
  to = "/",
  populate = false
){
  try {

    return await get<T[]>("chapters", { ...props, populate });
  } catch (err) {
    console.log(err);
  }
}
