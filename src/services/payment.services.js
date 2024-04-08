import Stripe from 'stripe'
import { stripeKey } from './environment.services.js'

export default class PaymentService {
    constructor() {
        this.stripe = new Stripe('sk_test_51Ow8pIRwV5TrntSwDlAjqj7YzuyZBWAr2tZoWkGFwQ04pNSjnNkdMvAxHrrpvPa0XKdq3uYglDMjh7dpXYP6SxFX008DCANe8l')
    }

    createPaymentIntent = async (data) => {
        const paymentIntent = this.stripe.paymentIntents.create(data)
        return paymentIntent
    }
}