import { Router } from "express"
import productModel from "../DAO/models/products.models.js"

const router = Router()

router.get('/', async (req, res) => {
    try {
        const products = await productModel.find().lean().exec()

        res.json({ status: 'success', payload: products })
    }
    catch (e) {
        res.send('an error ocurred:' + e)
    }
}
)


router.get('/:pid', async (req, res) => {
    try {
        const products = await productModel.findOne({ id: req.params.pid }).lean().exec()

        res.json({ status: 'success', payload: products })
    } catch (err) {
        res.send('an error has occurred:' + err)
    }
})


router.post('/', async (req, res) => {
    try {
        const newProduct = req.body
        const result = await productModel.create(newProduct)
        const updatedProducts = await productModel.find().lean().exec()
        req.app.get('socketio').emit('productsUpdate', updatedProducts)
        res.status(200).json(result)
    }

    catch (error) {
        console.log(error)
        return res.status(400).json({ message: error })
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const pid = req.params.pid
        if (req.body.id !== pid && req.body.id !== undefined) {
            return res.status(404).json({ error: 'cant modify products id' })
        }
        const updated = req.body
        const productToUpdate = await productModel.findById(pid)
        if (!productToUpdate) {
            return res.status(404).json({ error: 'no product matches that id' })
        }
        await productModel.updateOne({ _id: pid }, updated)
        const updatedProducts = await productModel.find().lean().exec()
        req.app.get('socketio').emit('productsUpdate', updatedProducts)
        res.status(200).json({ message:`updating product` })
    } catch (e) {
        console.error(e)
        res.status(500).json({ message: error })
        /* try {
            let id = parseInt(req.params.pid)
            let { updates } = req.body
            let updatedProducts = await ProductManager.getProducts()
            req.app.get('socketio').emit('productsUpdate', updatedProducts)
            ProductManager.updateProduct(id, updates, res)
        }
        catch {
            console.log(error)
            return res.status(400).json({ message: error })
        } */
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        let id = parseInt(req.params.pid)
        await productModel.deleteOne({ id: id })
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({ message: error })
    }
})



export default router