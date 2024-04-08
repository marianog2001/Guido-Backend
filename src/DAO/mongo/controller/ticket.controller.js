import TicketModel from '../models/ticket.model.js'

export default class TicketController {

    async createTicket(ticket) {
        const newTicket = await TicketModel.create(ticket)
        return newTicket
    }
    async updateTicketStatus(code, status) {
        const ticket = await TicketModel.findOneAndUpdate({ code: code }, { status: status }, { new: true })
        return ticket
    }
}