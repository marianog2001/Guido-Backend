import { Router } from 'express'
import { isUser } from '../utils.js'

const router = Router()

router.get('/',
    isUser,
    (req, res) => {
        res.render('chat', {})
    })

export default router