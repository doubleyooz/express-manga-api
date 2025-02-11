import { z } from 'zod';
import { genres, themes } from '../constants/titles';

export const loginSchema = z.object({
    email: z.string().email().min(1, 'email is required'),
    password: z.string().min(8, 'password must be at least 8 characters long'),
});

export const newTitleSchema = z.object({
    title: z.string().min(2, 'title is required'),
    genres: z.custom<string[]>(
        (val) => {
            if (!Array.isArray(val)) {
                return false;
            }
            if (val.length < 3 || val.length > 5) {
                return false;
            }
            return val.every((item) => genres.includes(item.toLowerCase()));
        },
        { message: 'genres must be on the list' }
    ),
    themes: z.custom<string[]>(
        (val) => {
            if (!Array.isArray(val)) {
                return false;
            }
            if (val.length < 3 || val.length > 5) {
                return false;
            }
            return val.every((item) => themes.includes(item.toLowerCase()));
        },
        { message: 'themes must be on the list' }
    ),
    synopsis: z
        .string()
        .min(10, 'synopsis must be at least 10 characters long')
        .max(400, 'synopsis must be a maximum of 400 characters'),
    nChapters: z.coerce.number().min(1, 'nChapters must be at least 1'),
    status: z.string(),
    nsfw: z.boolean(),
    type: z.string(),
    languages: z.string().array().min(1, 'languages is required'),
});

export type LoginFormProps = z.infer<typeof loginSchema>;

export type TitleFormProps = z.infer<typeof newTitleSchema>;
