import { Router } from "express"
import ProductManager from "../ProductManager.js"

const router = Router()

router.get('/', async(req,res) => {
    try {
        const limit = req.query.limit 

        const products = await ProductManager.getProducts()

        if (!limit) res.send( products )
        else {
            const productsLimit = products.slice(0, limit)
            res.json( productsLimit )
        }
    } catch (err) {
        res.send('an error has occurred')
        console.log(err)
    }
})

router.get('/:pid', async(req,res) => {
    try {
        const productId = parseInt(req.params.pid)

        const product = await ProductManager.getProductById(productId)

        if (!product) return res.send({ error: `the product you are requesting does not exist` })
        res.send( product )
    } catch (err) {
        res.send('an error has occurred')
    }
})

router.post('/', async(req,res) => {
    try {

        let { title, desc, price, thumbnail, code, category, stock, status } = req.body
        let newProduct = await ProductManager.addProducts(title, desc, price, thumbnail, code, category, stock, status)
        let updatedProducts = await ProductManager.getProducts()
        req.app.get('socketio').emit('productsUpdate',updatedProducts)
        res.status(200).json(newProduct)
    }

    catch (error){
        console.log(error)
        return res.status(400).json({message:error})
    }
})

router.put('/:pid', async(req,res) => {
    try {
        let id = parseInt(req.params.pid)
        let {updates} = req.body
        let updatedProducts = await ProductManager.getProducts()
        req.app.get('socketio').emit('productsUpdate',updatedProducts)
        ProductManager.updateProduct(id,updates,res)
    }
    catch{
        console.log(error)
        return res.status(400).json({message:error})
    }
})

router.delete('/:pid', async(req,res) => {
    try {
        let id = parseInt(req.params.pid)        
        await ProductManager.deleteProduct(id,res)
        let updatedProducts = await ProductManager.getProducts()
        req.app.get('socketio').emit('productsUpdate',updatedProducts)
    }
    catch{
        console.log(error)
        return res.status(400).json({message:error})
    }
})



export default router