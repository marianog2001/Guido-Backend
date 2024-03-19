import nodemailer from 'nodemailer'
import { gmailPass, gmailUser } from './environment.services.js'

// mailer
export const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: gmailUser,
        pass: gmailPass,
    },
})

export const generateRandomCode = (length) => {
    const alphabet =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < length; i++) {
        code += alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    }
    return code
}
