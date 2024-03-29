import { Router } from 'express'
import { logger } from '../services/logger.services.js'
import { verifyToken } from '../services/auth.services.js'
import passport from 'passport'

//adminCoder@coder.com
//adminCod3r123)


const router = Router()

router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        console.log(req.user.user)
        return res.render('index', req.user)
    })


router.get('/login', (req, res) => {
    return res.render('login')
})

router.get('/register', (req, res) => {
    return res.render('register')
})

router.get('/profile',
    async (req, res) => {
        const url = new URL('http://127.0.0.1:8080/api/session/current')
        /* console.log(url) */
        const user = await fetch(url, {
            method: 'GET',
            credentials: 'include' // Incluir cookies del navegador en la solicitud
        })
        console.log(user)
        return res.render('profile', user)
    }
)

router.get('/cart',
    verifyToken,
    async (req, res) => {
        let cartProducts = res.locals.user.user.cartId.products

        return res.render('cart', cartProducts)
    }
)

router.get('/checkout',
    verifyToken,
    (req, res) => {
        return res.render('checkout')
    })


export default router



