import TicketInsertDTO from '../DTO/ticket.dto.js'

export class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    async createTicket(price, userEmail, productsBought) {
        const ticket = new TicketInsertDTO(price, userEmail, productsBought)
        await this.dao.createTicket(ticket)
        return ticket
    }
}