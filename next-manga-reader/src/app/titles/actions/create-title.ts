'use server';

import { post } from '@/common/utils/axios';
import { ITitle, PartialITitle } from '../interfaces/title.interface';
import { redirect } from 'next/navigation';

export default async function createTitle(props?: PartialITitle, to = '/', populate = false) {
  try {
    return await post<ITitle[]>('mangas', { ...props, populate });
  } catch (err) {
    console.log(err);
    redirect(to);
  }
}
