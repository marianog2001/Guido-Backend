import { Router } from 'express'
import { generateProductMock } from '../services/mocks.services.js'

const router = Router()

router.get('/mockingproducts', async (req,res) => {
    const products = await generateProductMock()
    return res.status(200).render('products',products)
})

export default router