import fs from "fs"

export default class CartManager {
    constructor() {
        this.path = "./src/CartDB.json"
        this.format = "utf-8"
        this.carts = []
    }

    getCarts = async () => {
        try {
            return JSON.parse(await fs.promises.readFile(this.path, this.format))
        } catch (error) {
            console.error("file not found")
            return []
        }
    }

    getCartById = async (id) => {
        const carts = await this.getCarts()
        const cart = carts.find(c => c.id === id)
        if (cart) {
            return cart
        }
        else {
            console.error("Cart not found")
        }
    }

    createCart = async (products) => {
        const carts = await this.getCarts()
        products = []
        let id
        if (carts.length == 0) { id = carts.length }
        else { id = carts[carts.length - 1].id + 1 }
        let cart = {
            id: id,
            products: products
        }
        console.log(cart)
        carts.push(cart)
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts))
            return cart
        }
        catch (error) {
            console.log(error)
        }
    }

    addToCart = async (cartId, productId, quantity) => {
        try {
            const carts = await this.getCarts()
            let cart = await this.getCartById(cartId)
            if (!cart) { return console.error("cart not found") }
            console.log(cart.products)
            if (cart.products.find((product) => product.id == productId)) {

                cart.products[cart.products.findIndex((product) => product.id == productId)].quantity =+ quantity

            } else { cart.products.push({ id: productId, quantity: 1 }) }
            let cartIndex = carts.findIndex(cartToUpdate => cartToUpdate.id === cartId)
            carts[cartIndex] = cart
            fs.promises.writeFile(this.path, JSON.stringify(carts))
            return { cart }
        } catch (error) {
            console.log(error)
        }
    }
}

