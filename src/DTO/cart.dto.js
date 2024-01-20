export default class CartInsertDTO{
    constructor(cart) {
        this.products = cart?.products ?? [],
        this.total = cart?.total ?? 0
    }
}
