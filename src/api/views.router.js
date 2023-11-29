import { Router } from "express"

const router = Router()

router.get('/', async(req,res) => {
    try {
        res.render('index')
    } catch (err) {
        res.send('an error has occurred')
        console.log(err)
    }
})

/* router.get('/realtimeproducts', async(req,res) => {
    try {

        let products = await ProductManager.getProducts()

        res.render('realTimeProducts', {
            products : products
        })

        
    } catch (err) {
        res.send('an error has occurred')
        console.log(err)
    }
}) */


export default router


    
