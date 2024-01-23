import CartInsertDTO from '../DTO/cart.dto.js'

export class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getCart(cid) {
        const cart = await this.dao.getCart(cid)
        return cart
    }

    async createCart(products) {
        // const cartToInsert = new CartInsertDTO()
        // console.log(cartToInsert)
        const result = await this.dao.createCart(products)
        return result
    }

    async addProductToCart(cid, pid, quantity) {
        const result = await this.dao.addProductToCart(cid, pid, quantity)
        return result
    }

    async updateProductQuantity(cid, pid, quantity) {
        const result = await this.dao.updateProductQuantity(cid, pid, quantity)
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

    async purchaseCart(cart) {
        const result = await this.dao.purchaseCart(cart)
        return result
    }

}