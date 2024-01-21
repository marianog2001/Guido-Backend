import shortid from 'shortid'

export default class TicketInsertDTO{
    constructor(price, email, productsBought) {
        this.code = shortid.generate()
        this.products = productsBought
        this.price = price
        this.purchase_datetime = new Date()
        this.purchaser = email
    }
}
