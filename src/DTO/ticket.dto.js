export default class TicketInsertDTO{
    constructor(price, email, products) {
        this.code = Math.floor(Math.random() * 100000)
        this.products = products
        this.price = price
        this.purchase_datetime = new Date().toString()
        this.email = email
    }
}
