export default class customError {
    static createError({name='error', cause, message, code}) {
        const error = new Error(message,{cause})
        error.name = name
        error.code = code

        throw error
    }
}