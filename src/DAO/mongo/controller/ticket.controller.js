import TicketModel from '../models/ticket.model.js'

export default class TicketController {

    async createTicket(price, userEmail) {
        const ticket = await TicketModel.create({
            code
            price,
            userEmail
        })
        return ticket
    }



}