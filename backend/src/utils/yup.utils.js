import mongoose from 'mongoose';
import yup from 'yup';

import { getMessage } from '../utils/message.util.js';

const genres = [
    'action',
    'adventure',
    "boys' love",
    'comedy',
    'crime',
    'drama',
    'fantasy',
    "girls' love",
    'historical',
    'horror',
    'isekai',
    'magical girls',
    'mecha',
    'medical',
    'mystery',
    'philosophical',
    'psychological',
    'romance',
    'sci-fi',
    'slice of life',
    'sports',
    'superhero',
    'thriller',
    'tragedy',
    'wuxia',
];

const themes = [
    'aliens',
    'animals',
    'cooking',
    'crossdressing',
    'deliquents',
    'demons',
    'genderswap',
    'ghosts',
    'gyaru',
    'harem',
    'incest',
    'loli',
    'mafia',
    'magic',
    'martial arts',
    'military',
    'monster girls',
    'monsters',
    'music',
    'ninja',
    'office workers',
    'police',
    'post-apocalyptic',
    'reincarnation',
    'reverse harem',
    'samurai',
    'school life',
    'shota',
    'supernatural',
    'survival',
    'time travel',
    'traditional games',
    'vampires',
    'video games',
    'villainess',
    'virtual reality',
    'zombies',
];

const languages = [
    'da',
    'nl',
    'en',
    'fi',
    'fr',
    'de',
    'hu',
    'it',
    'nb',
    'pt',
    'ro',
    'ru',
    'tr',
    'es',
];

function isValidMongoIdRequired(value) {
    return (
        mongoose.Types.ObjectId.isValid(value) &&
        String(new mongoose.Types.ObjectId(value)) === value
    );
}

function isValidMongoId(value) {
    if (!!value) {
        mongoose.Types.ObjectId.isValid(value) &&
            String(new mongoose.Types.ObjectId(value)) === value;
    }
    return true;
}

const rules = {
    type_author: yup
        .string('type must be a string.')
        .strict()
        .matches(/(writer|artist)/, null),
    mongo_id_req: yup
        .string()
        .strict()
        .test('isValidMongoId', getMessage('invalid.object.id'), value =>
            isValidMongoIdRequired(value),
        ),
    mongo_id: yup
        .string()
        .strict()
        .test('isValidMongoId', getMessage('invalid.object.id'), value =>
            isValidMongoId(value),
        ),  
    username: yup.string('name must be a string.').min(3, getMessage('user.invalid.name.short')),
    authorname: yup.string('name must be a string.').min(3, getMessage('author.invalid.name.short')),
    birthDate: yup.date(),
    deathDate: yup
        .date()
        .min(
            yup.ref('birthDate') + 3650,
            'death date must be at least 10 years longer than birthDate',
        ),
    socialMedia: yup
        .array(yup.string('socialMedia must be a string.'))
        .min(1, '')
        .max(5, ''),
    biography: yup
        .string('biography')
        .strict()
        .min(15, getMessage('author.invalid.biography.short')),
    manga_title: yup
        .string('manga title must be a string.')
        .strict()
        .max(60, getMessage('manga.invalid.title.long')),
    chapter_title: yup
        .string('title must be a string.')
        .strict()
        .max(40, getMessage('chapter.invalid.title.long')),
    number: yup
        .number('Must to be a valid number')
        .min(1, 'Must be a positive number'),

    language: yup
        .string('language must be a string.')
        .strict()
        .matches(
            /^da$|^nl$|^en$|^fi$|^fr$|^de$|^hu$|^it$|^nb$|^pt$|^ro$|^ru$|^tr$|^es$/,
            null,
        )
        .default({ language: 'pt' }),

    title: yup
        .string('title must be a string.')
        .strict()
        .min(2, getMessage('manga.invalid.title.short'))
        .max(60, getMessage('manga.invalid.title.long')),
    genres: yup
        .array(yup.string())
        .min(3, '')
        .max(5, '')
        .test(
            'Valid genres',
            'Not all given ${path} are valid options',
            function (items) {
                if (items) {
                    return items.every(item => {
                        return genres.includes(item.toLowerCase());
                    });
                }

                return false;
            },
        ),
    themes: yup
        .array(yup.string())
        .min(3, '')
        .max(5, '')
        .test(
            'Valid themes',
            'Not all given ${path} are valid options',
            function (items) {
                if (items) {
                    return items.every(item => {
                        return themes.includes(item.toLowerCase());
                    });
                }
                return false;
            },
        ),

    synopsis: yup
        .string('synopsis must be a string.')
        .strict()
        .min(10, getMessage('manga.invalid.synopsis.short'))
        .max(400, getMessage('manga.invalid.synopsis.long')),
    n_chapters: yup
        .number('chapters must be a number.')
        .min(1, 'There must be at least one chapter.'),
    status: yup
        .number('status must be a number.')
        .min(1, getMessage('manga.invalid.code'))
        .max(6, getMessage('manga.invalid.code')),
    nsfw: yup
        .string('nsfw must be a string.')
        .strict()
        .matches(/(true|false)/, null),
    type_manga: yup
        .string('type must be a string.')
        .strict()
        .matches(/^manga$|^manhwa$|^manhua$/, null)
        .default({ type: 'manga' }),
    languages: yup
        .array(yup.string())
        .min(1, '')
        .max(languages.length, '')
        .default(['pt'])
        .test(
            'Valid languages',
            'Not all given ${path} are valid options',
            function (items) {
                if (items) {
                    return items.every(item => {
                        return languages.includes(item.toLowerCase());
                    });
                }
                return false;
            },
        ),
    text: yup
        .string('text must be a string.')
        .strict()
        .min(2, getMessage('text.invalid.text.short'))
        .max(500, getMessage('text.invalid.text.long')),

    rating: yup
        .number('rating must be a number.')
        .min(0, 'The minimum limit is 0.')
        .max(5, 'The maximum limit is 5.'),

    email: yup.string().email().required(),
    password: yup
        .string()
        .min(8, getMessage('user.invalid.password.short'))
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            getMessage('user.invalid.password.weak'),
        )
        .required(),
    
    role: yup.string().matches(/(Scan|User)/, null),
    sign_in_password: yup
        .string()
        .min(8, getMessage('user.invalid.password.short'))
        .required(),
};

export { rules };
