import { Router } from 'express'
import { CartService } from '../repositories/index.js'
import PaymentService from '../services/payment.services.js'
import passport from 'passport'

const router = Router()

router.post('/create-payment-intent',
    passport.authenticate('jwt', {session: false}),
    async (req, res) => {
        const { cartId } = req.body
        let cart = await CartService.getCart(cartId)
        const paymentIntentInfo = {
            amount: await CartService.calculateTotalAmount(cart),
            currency: 'usd',
        }
        const service = new PaymentService()
        let result = await service.createPaymentIntent(paymentIntentInfo)
        console.log(result)
        return res.send({ clientSecret: result.client_secret })
    })

export default router
