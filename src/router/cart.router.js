import { ProductService, CartService, TicketService } from '../repositories/index.js'
import { Router } from 'express'
import passport from 'passport'
import { handleAuth } from '../services/auth.services.js'


const router = Router()


//CREATE CART (WITHOUT AN ITEM)
router.post('/', async (req, res) => {
    try {
        const newCart = await CartService.createCart()
        console.log(newCart)
        return res.status(200).json({ status: 'done', payload: newCart })
    }
    catch (error) {
        console.log('error creating cart: ' + error)
        return res.status(500).json({ message: 'server error.' })
    }
}
)


//SEE CART
router.get('/:cid', async (req, res) => {
    try {
        let cid = req.params.cid
        let cart = await CartService.getCart(cid)

        return res.status(200).json({ status: 'success', payload: cart })
    } catch (error) {
        console.log('error getting cart: ' + error)
        return res.status(500).json({ message: 'server error.' })
    }
}
)

//ADD ONE ELEMENT TO A CART

router.post('/:cid/products/:pid',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            let cid = req.params.cid
            let pid = req.params.pid
            let quantity = parseInt(req.body?.quantity) ?? 1

            //checks if cart exists
            let cart = await CartService.getCart(cid)
            if (!cart) {
                console.log('couldn\'t find cart')
                return res.status(404).json({ message: 'Cart not found' })
            }
            //checks if product exists
            let product = await ProductService.getProducts(pid)
            if (product.owner === req.user.user.email) {
                return res.status(403).json({ message: 'you cannot add your own products to the cart' })
            }
            if (!product) {
                console.log('couldn\'t find product')
                return res.status(404).json({ message: 'Product not found' })
            }

            let result = await CartService.addProductToCart(cid, pid, quantity)

            console.log(result)
            return res.status(200).json({ status: 'success', payload: result })

        } catch (e) {
            console.error('an error ocurred trying to update the cart : ' + e)
            return res.status(500).json({ message: 'server error.' })
        }
    }
)

//DELETE AN ENTIRE CART

router.delete('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const cartToDelete = await CartService.getCart(cid)
        if (!cartToDelete) { return res.status(404).json({ message: 'cart not found' }) }
        const emptyCart = await CartService.deleteCart(cid)
        return res.status(200).json({ status: 'success', payload: emptyCart })
    } catch (e) {
        console.error('an error occurred while trying to delete the cart : ' + e)
        return res.status(500).json({ message: 'server error.' })
    }
}
)

// DELETE ONE ELEMENT FROM CART

router.delete(('/:cid/products/:pid'), async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        const cart = await CartService.getCart(cid)
        if (!cart) { return res.status(404).json({ message: 'cart not found' }) }
        await CartService.deleteElementFromCart(cid, pid)

        return res.status(200).json({ message: 'product succesfully removed' })
    } catch (e) {
        console.error('an error occurred while trying to delete the cart : ' + e)
    }
}
)

//MODIFY AN ITEM QUANTITY IN THE CART

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid)
        const pid = parseInt(req.params.pid)
        const newQuantity = parseInt(req.body.quantity)
        const cartToUpdate = await CartService.getCart(cid)
        if (!cartToUpdate) { return res.status(404).json({ message: 'cart not found' }) }
        if (typeof (newQuantity) !== 'number') { return res.status(400).json({ message: 'invalid quantity provided' }) }
        if (ProductService.getOneProduct(pid).stock < newQuantity) { return res.status(409).json({ message: 'there is not enough stock' }) }
        let updatedCart = await CartService.updateCartProductQuantity(cid, pid, newQuantity)
        if (!updatedCart) { return res.status(404).json({ message: 'product not found' }) }
        return res.status(200).json({ updatedCart })
    } catch (error) {
        console.error('an error occurred while trying to update the cart : ' + error)
        return res.status(500).json({ message: 'server error:' + error })
    }
}
)

// PURCHASE
router.post('/:cid/purchase',
    handleAuth,
    async (req, res) => {
        try {
            if (!req.user) {
                return res.redirect(403, '/error').json({ error: 'You must log in or register before buying' })
            }
            if (req.user.role !== 'user' || req.user.role !== 'premium') {
                return res.redirect(403, '/error').json({ error: 'An admin account can\'t buy' })
            }

            //informacion de usuario
            const cid = req.params.cid
            const userEmail = req.user.user.email

            //se trae el carrito
            const cart = await CartService.getCart(cid)

            if (!cart) {
                return res.status(404).redirect('/error').json({ error: 'cart not found' })
            }

            let stockResponse = await CartService.checkStock(cart)

            if (stockResponse !== true) {
                // modificar cart para cumplir la expectativa
                return res.render('cartStockConflict', stockResponse)
            }

            const { paymentIntent } = req.query

            const ticket = await TicketService.createTicket(cart, userEmail, paymentIntent)

            await CartService.purchaseCart(cart)

            return res.status(200).json({ status: 'success', payload: ticket })

        } catch (error) {
            return error
        }
    }
)

// ADD TO CART
router.post('/add-to-cart',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {

            const productId = req.body.productId
            const cartId = req.user.user.cartId._id

            await CartService.addProductToCart(cartId, productId)
            return res.status(200).json({ status: 'success' })

        } catch (error) {
            console.error(error)
            return res.status(500).json({ error })
        }
    }
)


export default router