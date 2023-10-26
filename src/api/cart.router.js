import { Router } from "express"
import CartManager from "../CartManager.js"

const router = Router()

router.post('/', async (req,res) => {
    try {
        let {products} = req.body
        let cart = await CartManager.createCart(products)
        res.status(200).json({cart})
    }
    catch (error){
        res.status(400).json({error})
    }
})

router.get('/:cid', async (req,res) => {
    try {
        let cid = parseInt(req.params.cid)
        let cart = await CartManager.getCartById(cid)
        res.status(200).json({cart})
    } catch (error) {
        res.status(400).json({error})
    }
})

router.post('/:cid/products/:pid', async (req,res) => {
    try {
        let cid = parseInt(req.params.cid)
        let pid = parseInt(req.params.pid)
        let cart = await CartManager.addToCart(cid,pid,1)
        res.status(200).json({cart:cart})
    } catch (error) {
        res.status(400).json({error})
    }
})

export default router