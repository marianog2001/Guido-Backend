export default class CartInsertDTO{
    constructor(cart) {
        this.products = cart?.products ?? []
    }
}
