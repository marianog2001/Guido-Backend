import TicketModel from '../models/ticket.model.js'

export default class TicketController {

    async createTicket(ticket) {
        const newTicket = await TicketModel.create(ticket)
        return newTicket
    }

}