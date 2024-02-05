import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { faker } from '@faker-js/faker'

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

export const isAdmin = (req,res,next) => {
    if (req.user.rol === 'admin') return next()
}

export const isUser = (req,res,next) => {
    if (req.user.rol === 'user') return next()
}
