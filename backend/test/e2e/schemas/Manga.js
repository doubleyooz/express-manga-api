const manga = (payload) => {
    return {        
        genres: payload.genres,
        languages: payload.languages,
        n_chapters: payload.n_chapters,     
        nsfw: payload.nsfw === "true",
        rating: 0,
        status: 2,
        synopsis: payload.synopsis,
        themes: payload.themes,
        title: payload.title,
        type: payload.type
    }
}

export { manga }