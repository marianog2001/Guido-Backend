/* import CartInsertDTO from '../DTO/cart.dto.js' */

export class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getCart(cid) {
        const cart = await this.dao.getCart(cid)
        return cart
    }

    async createCart() {
        // const cartToInsert = new CartInsertDTO()
        // logger.info(cartToInsert)
        const result = await this.dao.createCart()
        return result
    }

    async addProductToCart(cid, pid, quantity) {
        if (!quantity) {quantity = 1}
        const result = await this.dao.addProductToCart(cid, pid, quantity)
        return result
    }

    async updateCartProductQuantity(cid, pid, quantity) {
        const result = await this.dao.updateCartProductQuantity(cid, pid, quantity)
        return result
    }

    async deleteProductFromCart(cid, pid) {
        const result = await this.dao.deleteProductFromCart(cid, pid)
        return result
    }

    async cleanCart(cid) {
        const result = await this.dao.cleanCart(cid)
        return result
    }

    async checkStock(cid) {
        const result = await this.dao.checkStock(cid)
        return result
    }

    async purchaseCart(cart, user, paymentIntent) {
        const result = await this.dao.purchaseCart(cart, user, paymentIntent)
        return result
    }

    async getTotalPrice(cart) {
        const result = await this.dao.getTotalPrice(cart)
        return result
    }

}