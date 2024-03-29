import { ProductService } from '../repositories/index.js'
import { Router } from 'express'
import { isAdminOrPremium, isAdmin, verifyToken } from '../services/auth.services.js'
import { logger } from '../services/logger.services.js'
import passport from 'passport'

const router = Router()


router.get('/',
    verifyToken,
    async (req, res) => {
        try {
            let limit = parseInt(req.query?.limit ?? 10)
            let page = parseInt(req.query?.page ?? 1)
            let searchQuery = req.query?.search ?? null
            let sortQuery = parseInt(req.query?.sort) ?? null
            let stockQuery = (req.query?.stock === 'true') ?? null
            let categoryQuery = (req.query?.cat ?? '').replace(/_/g, ' ') ?? null

            const result = await ProductService.getProducts(limit, page, searchQuery, sortQuery, stockQuery, categoryQuery)
            return res.status(200).render('products', result)

        }
        catch (e) {
            logger.error(e)
            return res.send('an error ocurred:' + e)
        }
    })

router.get('/:pid', async (req, res) => {
    try {
        const product = await ProductService.getOneProduct(req.params.id)

        return res.status(200).render('productDetail', product)
    } catch (error) {
        res.status(500).send({ message: 'error fetching data:' + error })
    }
})

router.post('/',
    isAdmin,
    async (req, res) => {
        try {
            const newProduct = req.body
            const result = await ProductService.createProduct(newProduct)
            req.app.get('socketio').emit('productsUpdate')
            return res.status(200).json(result)
        }

        catch (error) {
            console.log(error)
            return res.status(400).json({ message: error })
        }
    })

router.put('/:pid',
    passport.authenticate('jwt', { session: false }),
    isAdminOrPremium,
    async (req, res) => {
        try {
            const pid = req.params.pid

            //this conditional is to make id unchangeable
            if (req.body.id !== pid && req.body.id !== undefined) {
                return res.status(404).json({ error: 'cant modify products id' })
            }


            const updated = req.body
            const productToUpdate = await ProductService.getOneProduct(pid)
            if (productToUpdate.owner !== req.user.user.email || !req.user.user.role !== 'admin') return res.status(401).json({ error: 'unauthorized' })
            if (!productToUpdate) {
                return res.status(404).json({ error: 'no product matches that id' })
            }

            await ProductService.updateOneProduct(pid, updated)

            const updatedProducts = await ProductService.getProducts()
            req.app.get('socketio').emit('productsUpdate', updatedProducts)
            res.status(200).json({ message: 'updating product' })
        } catch (error) {
            logger.error('Error on update product function : ' + error)
            res.status(500).json({ message: error })
        }
    })

router.delete('/:pid',
    passport.authenticate('jwt', { session: false }),
    isAdmin,
    async (req, res) => {
        try {

            let pid = req.params.pid
            const productToDelete = await ProductService.getProducts(pid)
            if (productToDelete.owner !== req.user.user.email || !req.user.user.role !== 'admin') return res.status(401).json({ error: 'unauthorized' })
            await ProductService.deleteProduct(pid)
        }
        catch (error) {
            console.error(error)
            return res.status(500).json({ message: error })
        }
    })

export default router