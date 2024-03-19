import { Router } from 'express'
import { isUser } from '../services/auth.services.js'

const router = Router()

router.get('/',
    isUser,
    (req, res) => {
        res.render('chat', {})
    })

export default router