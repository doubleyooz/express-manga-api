'use server';

import { get } from '@/common/utils/axios';
import { ITitle, PartialITitle } from '../interfaces/title.interface';
import { redirect } from 'next/navigation';

export default async function getTitles(
    props?: PartialITitle,
    to = '/',
    populate = false
) {
    try {
        return await get<ITitle[]>('mangas', { ...props, populate });
    } catch (err) {
        console.log(err);
        redirect(to);
    }
}
