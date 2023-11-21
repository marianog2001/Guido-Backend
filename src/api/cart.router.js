import { Router } from "express"
import CartModel from "../DAO/models/cart.models.js"
import ProductModel from "../DAO/models/products.models.js"

const router = Router()

router.post('/', async (req, res) => {
    try {
        let products = req.body
        let cart = await CartModel.create(products)
        res.status(200).json({ cart })
    }
    catch (error) {
        res.status(400).json({ error })
    }
})

router.get('/:cid', async (req, res) => {
    try {
        let cid = req.params.cid
        let cart = await CartModel.findById(cid)
        res.status(200).json({ status:'success',payload:cart})
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        let cid = req.params.cid
        let pid = req.params.pid
        let cart = CartModel.findById(cid)
        if (!cart) {
            console.log("couldn't find cart")
            return res.status(404).json({ message: error })
        }
        let product = ProductModel.findById(pid)
        if (!product) {
            console.log("couldn't find product")
            return res.status(404).json({ message: error })            
        }
        let productIndex = cart.products.findIndex(item => item.product.toString() === pid)
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1
        } else {
            const newProduct = {
                product: pid,
                quantity: 1,
            }
            cart.products.push(newProduct)}
        let result = await cart.save()
        res.status(200).json({ status: "success", payload: result })

    } catch (error) {
        res.status(400).json({ error })
    }
})



export default router