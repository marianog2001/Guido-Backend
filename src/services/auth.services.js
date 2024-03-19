import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { jwtSecret } from './environment.services.js'

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const passwordValidator = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const generateToken = (user) => {
    const token = jwt.sign({ user }, jwtSecret, { expiresIn: '24h' })

    return token
}

export const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') return next()
    else throw new Error('You are not an admin')
}

export const isPremium = (req, res, next) => {
    if (req.user.user.role === 'premium') return next()
    else throw new Error('You are not a premium user')
}

export const isAdminOrPremium = (req, res, next) => {
    if (req.user.user.role === 'admin' || req.user.user.role === 'premium') return next()
    else throw new Error('You are not an admin or premium user')
}

export const isUser = (req, res, next) => {
    if (req.user.user.role === 'user') return next()
    else throw new Error('You are not a user')

}