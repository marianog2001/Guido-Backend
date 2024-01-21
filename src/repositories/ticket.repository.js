import TicketInsertDTO from '../dto/ticket.insert.dto.js'

export class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    async createTicket(price , userEmail ) {
        const ticket = new TicketInsertDTO(price , userEmail)
        
        return ticket
    }
}