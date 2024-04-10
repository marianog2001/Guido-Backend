
import { ProductService } from './index.js'

export class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getCart(cid) {
        const cart = await this.dao.getCart(cid)
        return cart
    }

    async createCart() {
        const result = await this.dao.createCart()
        return result
    }

    async addProductToCart(cid, pid, quantity = 1) {
        let cart = await this.dao.getCart(cid)
        if (!cart) {
            return { message: 'couldn\'t find cart' }
        }
        if (!await ProductService.productExists(cart)) {
            return { message: 'couldn\'t find product' }
        }
        let result = await this.dao.addProductToCart(cart, pid, quantity)
        return result
    }

    async updateCartProductQuantity(cid, pid, quantity = 1) {
        let cart = await this.dao.getCart(cid)
        if (quantity <= 0) {
            const result = await this.dao.deleteProductFromCart(cid, pid)
            console.log('product deleted from cart', pid)
            return result
        }
        if (!cart) {
            return { message: 'couldn\'t find cart' }
        }
        let productIndex = cart.products.findIndex(item => item.product.toString() === pid)
        if (productIndex !== -1) {
            //si lo encuentra (si el indice es distinto de -1) actualizará su cantidad
            const result = await this.dao.updateCartProductQuantity(cid, pid, quantity)
            return result
        } else {
            //si no lo encuentra, agregará el producto
            return this.dao.addProductToCart(cid, pid, quantity)
        }
    }

    async deleteProductFromCart(cid, pid) {
        const result = await this.dao.deleteProductFromCart(cid, pid)
        return result
    }

    async checkStock(cid) {
        const cart = await this.dao.getCart(cid)
        const result = await this.dao.checkStock(cart)
        return result
    }

    async purchaseCart(cart) {
        const result = await this.dao.purchaseCart(cart)
        return result
    }

    async getTotalPrice(cart) {
        const result = await this.dao.getTotalPrice(cart)
        return result
    }

}