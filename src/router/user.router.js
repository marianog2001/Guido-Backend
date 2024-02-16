import passport from 'passport'
import { UserService } from '../repositories/index.js'
import { generateRandomCode, generateToken, transport } from '../utils.js'
import { gmailUser } from '../environment.js'
import { Router } from 'express'
/* import CurrentInsertDTO from '../DTO/current.dto.js' */
import { logger } from '../logger.js'




//adminCoder@coder.com
//adminCod3r123)


const router = Router()

router.get('/logout', async (req, res) => {
    res.cookie.destroy('cookieJWT').send()
})

router.post('/login',
    await passport.authenticate('login', {
        session: false,
        failureRedirect: 'error',
        failureMessage: true,
    }),
    async (req, res) => {
        const user = req.user
        const token = generateToken(user)
        res.cookie('cookieJWT', token)
        return res.redirect('/')
    }
)

router.post(
    '/register',
    passport.authenticate('register', {
        session: false,
        failureMessage: true,
    }),
    async (req, res) => {
        res.send('registered')
    }
)

router.get('/error', (req, res) => {
    const error = req?.query ?? 'server error'
    logger.error(error)
    res.render('errors/errorPage', {
        status: 'error',
        error,
    })
})

router.get(
    '/current',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const user = req.user
        logger.debug(user)
        res.render('profile', user)
    }
)

//si no anda probar con el req,res !!!!!
router.get('/github', async () => {
    passport.authenticate('github', { scope: ['user:email'] })
})

router.get('/github/callback', async (req, res) => {
    passport.authenticate('github', { failureRedirect: '/login' })
    if (!req.user) {
        return res.status(500).send({ message: 'invalid github' })
    }
    res.cookie('cookieJWT', req.user.token)
    return res.redirect
})




// ------------- RESET PASSWORD -------------

router.post('/resetPassword', async (req, res) => {
    try {
        const { email } = req.body
        const resetCode = generateRandomCode(5)
        await UserService.startPasswordReset(email, resetCode)
        transport.sendMail({
            from: gmailUser,
            to: email,
            subject: 'Reset Password',
            html: `The reset code is: ${resetCode}`
        })
        res.status(200).json({ message: 'email sent' })
    }
    catch (error) {
        res.status(500).send(error)
    }

})

router.post('/resetPassword/enterCode', async (req, res) => {
    try {
        const { resetCode } = req.body
        const { password } = req.body
        if (!resetCode || !password) {
            return res.status(400).send({ message: 'invalid data' })
        }
        if (resetCode.length !== 5) {
            return res.status(400).send({ message: 'invalid code' })
        }
        const result = await UserService.resetPassword(resetCode, password)
        res.send(result)
    }
    catch (error) {
        logger.error('Error in reset password / enter code router : ' + error)
        res.status(500).send({ message: 'Error at reset password / enter code router ', error })
    }
})
export default router