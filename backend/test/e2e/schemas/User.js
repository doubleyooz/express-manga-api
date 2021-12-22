const schema = (payload) => {
    return {
        role: payload.role,
        mangas: [],
        manga_alert: [],
        likes: [],
        reviews: [],
        token_version: 0,
        active: false,
        resetLink: '',
        email: payload.email,
        name: payload.name,

        __v: 0
    }
}

const sign_in = (payload) => {
    return {
        role: payload.role,
        token_version: 0,
        _id: payload._id,
    }
}

export { schema, sign_in }