import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import EErrors from './errors/enums.js'
import { jwtSecret, gmailUser, gmailPass } from './environment.js'
import nodemailer from 'nodemailer'

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
    const token = jwt.sign({ user }, jwtSecret, { expiresIn: '24h' })

    return token
}

export const isAdmin = (req, res, next) => {
    if (req.user.rol === 'admin') return next()
}

export const isUser = (req, res, next) => {
    if (req.user.rol === 'user') return next()
}


//error handler

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

// mailer
export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: gmailUser,
        pass: gmailPass
    }
})

export const generateRandomCode = (length) => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < length; i++) {
        code += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
    return code
}