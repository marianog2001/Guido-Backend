import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import EErrors from './errors/enums.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)



export default __dirname

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const passwordValidator = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}


//jwt
export const generateToken = (user) => {
    const token = jwt.sign({ user }, 'coderTokenForJWT', { expiresIn: '24h' })

    return token
}

export const isAdmin = (req, res, next) => {
    if (req.user.rol === 'admin') return next()
}

export const isUser = (req, res, next) => {
    if (req.user.rol === 'user') return next()
}


//errors

export const errorHandler = (error, req, res, next) => {
    console.error(error)

    switch (error.code) {
    case EErrors.INVALID_TYPES_ERROR:
        return res.status(400).send({
            status: 'error',
            error: error.name,
            cause: error.cause
        })

    default:
        res.status(500).send({
            status: 'error',
            error: 'unhandled error'
        })
    }
}