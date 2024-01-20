import CartInsertDTO from '../DTO/cart.dto.js'

export class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getCart(cid) {
        const cart = await this.dao.getCart(cid)
        return cart
    }

    async createCart(cid) {
        const cartToInsert = new CartInsertDTO(cid)
        const result = await this.dao.createCart(cartToInsert)
        return result
    }

    async addElementToCart(cid, pid, quantity) {
        const result = await this.dao.addElementToCart(cid, pid, quantity)
        return result
    }

    async updateProductQuantity(cid, pid, quantity) {
        const result = await this.dao.updateProductQuantity(cid, pid, quantity)
        return result
    }

    async deleteElementFromCart(cid, pid) {
        const result = await this.dao.deleteElementFromCart(cid, pid)
        return result
    }

    async cleanCart(cid) {
        const result = await this.dao.cleanCart(cid)
        return result
    }


}