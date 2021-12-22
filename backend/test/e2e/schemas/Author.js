
const author = (payload, photo) => {
    return {
        type: [payload.type],
        photos: [
            {
                originalname: photo.name,
                size: photo.size
            },
        ],
        works: [],
        socialMedia: payload.socialMedia,
        //_id: '617f58e87ab874251ce7cd58',
        name: payload.name,
        birthDate: payload.birthDate,
        deathDate: null,
        biography: payload.biography,
        //createdAt: '2021-11-01T03:03:04.290Z',
        //updatedAt: '2021-11-01T03:03:04.290Z',
        __v: 0,
    }

}

export { author }