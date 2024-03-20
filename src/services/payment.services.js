import Stripe from 'stripe'
import { stripeKey } from './environment.services.js'

export default class PaymentService {
    constructor() {
        this.stripe = new Stripe(stripeKey)
    }

    createPaymentIntent = async (data) => {
        const paymentIntent = this.stripe.paymentIntents.create(data)
        return paymentIntent
    }
}