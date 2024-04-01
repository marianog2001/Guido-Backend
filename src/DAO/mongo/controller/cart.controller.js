import CartModel from '../models/cart.model.js'
import productModel from '../models/products.models.js'
import { logger } from '../../../services/logger.services.js'




export default class Carts {

    async getCart(cid) {
        try {
            let cart = await CartModel.findById(cid).populate('products.product')
            return cart
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async createCart() {
        try {
            let newCart = await CartModel.create({ products: [] })
            // logger.debug(newCart)
            return newCart
        } catch (error) {
            logger.error(error)
            return error
        }
    }


    async addProductToCart(cid, pid, quantity) {
        try {
            let cart = await CartModel.findOne({ _id: cid })

            let productIndex = cart.products.findIndex(item => item.product.toString() === pid)
            if (productIndex !== -1) {
                return { message: 'object is already on the cart, try update quantity' }
            } else {
                // if the product is not in the cart, add it
                const newProduct = {
                    product: pid,
                    quantity
                }
                cart.products.push(newProduct)
            }
            await cart.save()
            return cart

        } catch (error) {
            logger.error(error)
            return error
        }
    }


    async updateCartProductQuantity(cart, pid, quantityProvided) {
        try {
            cart.products.find(product => product.product === pid).quantity = quantityProvided
            await cart.save()
            return cart
        } catch (error) {
            logger.error(error)
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
            logger.error(error)
            return error
        }
    }

    async cleanCart(cart) {
        try {
            cart.products = []
            await cart.save()
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async checkStock(cart) {
        try {
            for (let i = 0; i < cart.products.length; i++) {
                let product = await productModel.findById(cart.products[i].product)
                if (product.stock < cart.products[i].quantity) {
                    return { success: false, conflictingProduct: product.id }
                }
            }
            return true
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async purchaseCart(cart) {
        try {
            let stockResponse = await this.checkStock(cart)
            if (stockResponse !== true) return stockResponse

            await this.discountStock(cart)

            let totalAmount = await this.calculateTotalAmount(cart)

            await cart.cleanCart()
            await cart.save()

            return totalAmount

        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async calculateTotalAmount(cart) {
        try {
            let total = 0
            for (let index = 0; index < cart.products.length; index++) {
                total = (await productModel.findById(cart.products[index].product) * cart.products[index].quantity)
                return total
            }
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async discountStock(cart) {
        try {
            for (let index = 0; index < cart.products.length; index++) {
                let productToDiscount = await productModel.findById(cart.products[index].product)
                productToDiscount.stock = - cart.products[index].quantity
                await productToDiscount.save()
                continue
            }
        } catch (error) {
            logger.error(error)
            return error
        }
    }

}