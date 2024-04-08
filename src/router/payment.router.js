import { Router } from 'express'
import passport from 'passport'
import PaymentService from '../services/payment.services.js'
import { CartService, TicketService } from '../repositories/index.js'

const router = Router()

router.post('/create-payment-intent',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const paymentIntentInfo = {
            amount: req.body.amount,
            currency: 'usd',
        }
        const service = new PaymentService()

        let cart = await CartService.getCart(req.user.user.cartId._id)

        let result = await service.createPaymentIntent(paymentIntentInfo)
        
        let price = await CartService.getTotalPrice(cart)
        let userEmail = req.user.user.email

        let response = await CartService.purchaseCart(cart)
        if (!response.success) { return res.json({response: 'not enough stock'})}

        await TicketService.createTicket(price, userEmail, cart.products, result.id)
        
        return res.send(result)
    })

export default router
