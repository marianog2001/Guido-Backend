import { Router } from "express"
import ProductManager from "../DAO/fileSystem/ProductManager.js"

const router = Router()

router.get('/', async(req,res) => {
    try {
        const limit = req.query.limit 

        const products = await ProductManager.getProducts()

        if (!limit) res.render('home', {
            products : products
        })
        else {
            const productsLimit = products.slice(0, limit)
            res.render('home', {
                products : productsLimit
            })
        }
    } catch (err) {
        res.send('an error has occurred')
        console.log(err)
    }
})

router.get('/realtimeproducts', async(req,res) => {
    try {

           /*  socket.on('productsUpdate', (products) => {
            res.render('realTimeProducts', {
            products : products
        })

        }) */

        let products = await ProductManager.getProducts()

        res.render('realTimeProducts', {
            products : products
        })

        
    } catch (err) {
        res.send('an error has occurred')
        console.log(err)
    }
})



export default router


    
