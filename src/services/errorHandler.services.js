import EErrors from '../errors/enums.js'

// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, req, res, next) => {

    switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
        return res.status(400).json({
            status: 'error',
            error: error.name,
            cause: error.cause
        })

    default:
        res.status(500).json({
            status: 'error',
            error: 'unhandled error'
        })
    }
}