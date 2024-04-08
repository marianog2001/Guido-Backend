import TicketInsertDTO from '../DTO/ticket.dto.js'

export class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    async createTicket(price, userEmail, productsBought, paymentIntent) {
        const ticket = new TicketInsertDTO(price, userEmail, productsBought, paymentIntent)
        await this.dao.createTicket(ticket)
        return ticket
    }

    async updateTicketStatus(code, status) {
        const ticket = await this.dao.updateTicketStatus(code, status)
        return ticket
    }
}