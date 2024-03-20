import { Router } from 'express'
import { CartService } from '../repositories'
import PaymentService from '../services/payment.services.js'

const router = Router()

router.post('/payment-intent', async (req, res) => {
    const { id } = req.body
    let cart = await CartService.getCart(id)
    const paymentIntentInfo = {
        amount: await CartService.calculateTotalAmount(cart),
        currency: 'usd',
    }
    const service = new PaymentService()
    let result = await service.createPaymentIntent(paymentIntentInfo)
    console.log(result)
    return res.send({clientSecret: result.client_secret})
})

export default router
