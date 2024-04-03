import { Router } from 'express'
import { CartService } from '../repositories/index.js'
import { handleAuth } from '../services/auth.services.js'

//adminCoder@coder.com
//adminCod3r123)


const router = Router()

router.get('/',
    handleAuth,
    async (req, res) => {

        return res.render('index', req.user)
    })



router.get('/login', (req, res) => {
    return res.render('login')
})

router.get('/register', (req, res) => {
    return res.render('register')
})

router.get('/profile',
    handleAuth,
    async (req, res) => {
        console.log(res.locals)
        return res.render('profile', req.user)
    }
)

router.get('/cart',
    handleAuth,
    async (req, res) => {
        let cartId, cart
        if (res.locals.auth) {
            cartId = res.locals.user.user.cartId._id
            cart = await CartService.getCart(cartId)
        }
        console.log(cart.products)
        return res.render('cart', { cartProducts: cart.products, cartId: cartId })
    }
)

router.get('/checkout',
    handleAuth,
    (req, res) => {
        return res.render('checkout')
    })


export default router



