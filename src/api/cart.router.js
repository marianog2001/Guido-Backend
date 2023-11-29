import { Router } from "express"
import CartModel from "../DAO/models/cart.models.js"
import ProductModel from "../DAO/models/products.models.js"


const router = Router()

router.post('/', async (req, res) => {
    try {
        let pid = req.body.id
        /* console.log(product) */
        let cart = new CartModel()
        if (pid) {
            cart.products.push({product:pid})
            cart.save()
            return res.status(200).json({status : 'done'})
        }
        
        cart.save()
        return res.status(200).json({status : 'done'})
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ error })
    }
})

router.get('/:cid', async (req, res) => {
    try {
        let cid = req.params.cid
        let cart = await CartModel.findById(cid).populate('products.product')
        console.log(cart)
        res.status(200).json({ status:'success',payload:cart})
    } catch (error) {
        console.log('error: ' + error)
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        let cid = req.params.cid
        let pid = req.params.pid
        let cart = await CartModel.findById(cid)
        if (!cart) {
            console.log("couldn't find cart")
            return res.status(404).json({ message: 'Cart not found' })
        }
        let product = await ProductModel.findById(pid)
        if (!product) {
            console.log("couldn't find product")
            return res.status(404).json({ message: 'Product not found' })            
        }
        let productIndex = cart.products.findIndex(item => item.product.toString() === pid)
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1
        } else {
            const newProduct = {
                product: pid,
                quantity: 1,
            }
            cart.products.push({product:newProduct})
        }
        let result = await cart.save()
        result = await cart.findById(cid)
        console.log(result)
        res.status(200).json({ status: "success", payload: result })

    } catch (e) {
        console.error('an error ocurred trying to update the cart : ' + e )
        res.status(500).json({ message: 'server error.' });
    }
})

router.delete('/:cid', async (req,res) => {
    try {
        cid = req.params.cid
        let cartToDelete = await CartModel.findById(cid)
        if (!cartToDelete) {return res.status(404).json({message : 'cart not found'})}
        let update = await CartModel.updateOne({_id : cid } , { $set : {products : []} } )
        res.status(200).json({message : 'cart succesfully deleted'})
    } catch(e) {
        console.error('an error occurred while trying to delete the cart : ' + e)
    }
    
})

router.delete('/:cid/products/:pid', async (req,res) => {
    try {
        let cid = req.params.cid
        let pid = req.params.pid
        let cart = await CartModel.findById(cid)
        if (!cart) {return res.status(404).json({message : 'cart not found'})}
        let index = cart.products.indexOf(product => product.id === pid)
        if (!index) {return res.status(404).json({message: 'product not found in cart'})}
        cart.products.splice(index,1)
        cart.save()
        res.status(200).json({message : 'product succesfully removed'})
    } catch(e) {
        console.error('an error occurred while trying to delete the cart : ' + e)
    }
    
})

router.put('/:cid', async (req,res) => {
    let cid = req.params.cid
    let products = req.body
    console.log(products)
    let cart = await CartModel.findById(cid)
    if (!cart) {return res.status(400).json({message:'cart not found'})}
    cart.products = products
    let updatedCart = await cart.save()
    
    return res.status(200).json( {updatedCart})
})

router.put('/:cid/products/:pid', async (req,res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    let newQuantity = parseInt(req.body.quantity)
    if (isNaN(newQuantity)) {return res.status(200).json({message : 'invalid quantity'})}
    let cartToUpdate = await CartModel.findById(cid)
    if (!cartToUpdate) {return res.status(400).json({message:'cart not found'})}
    console.log(pid)
    let index = cartToUpdate.products.findIndex(product => product._id == pid)
    if (index === -1) {return res.status(404).json({message : 'product not found'})}
    cartToUpdate.products[index].quantity = newQuantity
    let updatedCart = await cartToUpdate.save()
    
    return res.status(200).json( {updatedCart})
})


export default router