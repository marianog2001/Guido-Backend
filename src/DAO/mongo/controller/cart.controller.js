import CartModel from '../models/cart.model.js'
import productModel from '../models/products.models.js'
import { logger } from '../../../services/logger.services.js'  




export default class Carts {

    async getCart(cid) {
        try {
            let cart = await CartModel.findById(cid).populate('products.product')
            return cart
        } catch (error) {
            return error
        }
    }

    async createCart() {
        try {
            let newCart = await CartModel.create({products : []})
            // logger.debug(newCart)
            return newCart
        } catch (error) {
            return error
        }
    }


    async addProductToCart(cid, pid) {
        try {
            let cart = await CartModel.findOne({ _id: cid })

            let productIndex = cart.products.findIndex(item => item.product.toString() === pid)
            if (productIndex !== -1) {
                return { message: 'object is already on the cart, try update quantity' }
            } else {
                // if the product is not in the cart, add it
                const newProduct = {
                    product: pid,
                    quantity: 1
                }
                cart.products.push(newProduct)
            }
            await cart.save()
            return cart

        } catch (error) {
            return error
        }
    }


    async updateCartProductQuantity(cart, pid, quantityProvided) {
        try {
            cart.products.find(product => product.product === pid).quantity = quantityProvided
            await cart.save()
            return cart
        } catch (error) {
            return error
        }
    }


    async deleteProductFromCart(cart, pid) {
        try {
            let productIndex = cart.products.findIndex(item => item.product.toString() === pid)
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1)
            }
            await cart.save()
        } catch (error) {
            return error
        }
    }

    async cleanCart(cart) {
        try {
            cart.products = []
            await cart.save()
        } catch (error) {
            return error
        }
    }

    async checkStock(cart) {
        try {
            for (let i = 0; i < cart.products.length; i++) {
                let product = await productModel.findById(cart.products[i].product)
                if (product.stock < cart.products[i].quantity) {
                    return false
                }
            }
            return true
        } catch (error) {
            return error
        }
    }

    async purchaseCart(cart) {
        try {
            let price
            for (let i = 0; i < cart.products.length; i++) {
                let product = await productModel.findById(cart.products[i].product)
                product.stock = product.stock - cart.products[i].quantity
                price = + product.price * cart.products[i].quantity
                await product.save()
            }
            await cart.cleanCart()
            await cart.save()
            return price
        } catch (error) {
            return error
        }
    }

}