import { Router } from 'express'
import passport from 'passport'
import PaymentService from '../services/payment.services.js'
import { CartService } from '../repositories/index.js'

const router = Router()

router.post('/create-payment-intent',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const paymentIntentInfo = {
            amount: req.body.amount,
            currency: 'usd',
        }
        const service = new PaymentService()
        let result = await service.createPaymentIntent(paymentIntentInfo)
        let cart = await CartService.getCart(req.user.user.cartId._id)

        await CartService.purchaseCart(cart, req.user, result.id)

        return res.send(result)
    })

export default router
