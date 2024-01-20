import { ProductService, CartService } from '../repositories/index.js'
import { Router } from 'express'

const router = Router()


//CREATE CART (WITH OR WITHOUT AN ITEM)

router.post('/', async (req, res) => {
    try {
        await CartService.createCart()
        return res.status(200).json({ status: 'done' })
    }
    catch (error) {
        console.log('error creating cart: ' + error)
        return res.status(500).json({ message: 'server error.' })
    }
}
)

//SEE CART DSDGDFJNHJFGIHIUJOFGDNBMJKGDCBKLMDGV
router.get('/:cid', async (req, res) => {
    try {
        let cid = parseInt(req.params.cid)
        let cart = await CartService.getCart(cid)
        
        return res.status(200).json({ status: 'success', payload: cart })
    } catch (error) {
        console.log('error getting cart: ' + error)
        return res.status(500).json({ message: 'server error.' })
    }
}
)

//ADD ONE ELEMENT TO A CART

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        let cid = parseInt(req.params.cid)
        let pid = parseInt(req.params.pid)
        let quantity = parseInt(req.body?.quantity) ?? 1

        //checks if cart exists
        let cart = await CartService.getCart(cid)
        if (!cart) {
            console.log('couldn\'t find cart')
            return res.status(404).json({ message: 'Cart not found' })
        }

        //checks if product exists
        let product = await ProductService.getProduct(pid)
        if (!product) {
            console.log('couldn\'t find product')
            return res.status(404).json({ message: 'Product not found' })
        }

        let result = await CartService.addProductToCart(cid, pid, quantity)
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
        let cartToDelete = await CartService.getCart(cid)
        if (!cartToDelete) { return res.status(404).json({ message: 'cart not found' }) }
        let emptyCart = await CartService.deleteCart(cid)
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
        let cid = parseInt(req.params.cid)
        let pid = parseInt(req.params.pid)
        let cart = await CartService.getCart(cid)
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
        let cid = parseInt(req.params.cid)
        let pid = parseInt(req.params.pid)
        let newQuantity = parseInt(req.body.quantity)
        let cartToUpdate = await CartService.getCart(cid)
        if (!cartToUpdate) { return res.status(400).json({ message: 'cart not found' }) }

        let updatedCart = await CartService.updateCartProductQuantity(cid, pid, newQuantity)
        if (!updatedCart) { return res.status(400).json({ message: 'product not found' }) }
        return res.status(200).json({ updatedCart })
    } catch (error) {
        console.error('an error occurred while trying to update the cart : ' + error)
        return res.status(500).json({ message: 'server error:' + error })
    }
}
)

export default router