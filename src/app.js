import express from 'express'
import ProductManager from './ProductManager.js'

const app = express()

app.get('/products', async(req, res) => {
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

app.get('/products/:pid', async(req,res) => {
    try {
        const productId = parseInt(req.params.pid)

        const product = await ProductManager.getProductById(productId)

        if (!product) return res.send({ error: `the product you are requesting does not exist` })
        res.send( product )
    } catch (err) {
        res.send('an error has occurred')
    }
})


app.listen(8080, () => {
    console.log('server running');
})