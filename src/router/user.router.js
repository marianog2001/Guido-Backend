import passport from 'passport'
import { ProductService, UserService } from '../repositories/index.js'
import { generateToken, isAdminOrPremium } from '../services/auth.services.js'
import { gmailUser } from '../services/environment.services.js'
import { generateRandomCode, transport } from '../services/mailer.services.js'
import { Router } from 'express'
/* import CurrentInsertDTO from '../DTO/current.dto.js' */
import { logger } from '../services/logger.services.js'




//adminCoder@coder.com
//adminCod3r123)


const router = Router()

router.get('/logout', async (req, res) => {
    res.clearCookie('cookieJWT').redirect('/')
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
        return res.status(200).json(user)
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

// ------------- PREMIUM FEATURES -------------

router.post('/premium/:uid', async (req, res) => {
    try {
        const { uid } = req.params
        await UserService.changePremium(uid)
        res.status(200).send({ message: 'success' })
    } catch (error) {
        logger.error('Error in premium add / remove router : ' + error)
        res.status(500).send(error)
    }

})

router.post('/test',
    await passport.authenticate('jwt', { session: false }),

    async (req, res) => {
        logger.debug(req.user)
        res.send('ok')
    }
)

router.post('/createProduct',
    await passport.authenticate('jwt', { session: false }),
    isAdminOrPremium,
    async (req, res) => {

        const newProduct = req.body

        const user = req.user.user.email

        try {
            ProductService.createProduct(newProduct, user)
            res.status(200).send({ message: 'Product created succesfully' })
        }
        catch (error) {
            logger.error('Error in create product router : ' + error)
            res.status(500).send({ message: 'An error ocurred creating the product' })
        }
    })


router.get('/getAllUsers',
    async (req, res) => {
        const payload = await UserService.getUsers()
        return res.status(200).send(payload)
    }
)


export default router