import TicketInsertDTO from '../DTO/ticket.dto.js'
import { CartService } from './index.js'

export class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    async createTicket(cart, userEmail, paymentIntent) {
        let price = await CartService.getTotalPrice(cart)
        let productsBought = cart.products
        const ticket = new TicketInsertDTO(price, userEmail, productsBought, paymentIntent)
        await this.dao.createTicket(ticket)
        return ticket
    }

    async updateTicketStatus(code, status) {
        const ticket = await this.dao.updateTicketStatus(code, status)
        return ticket
    }
}