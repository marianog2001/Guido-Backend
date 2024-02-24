import { Router } from 'express'
import { logger } from '../logger.js'

//adminCoder@coder.com
//adminCod3r123)


const router = Router()

router.get('/',
    verificarToken,
    (req, res) => {
        logger.info(`Ruta ${req.url} metodo ${req.method} implementada`)
        return res.render('index', req.user)
    })

router.get('/login', (req, res) => {
    return res.render('login')
})

router.get('/register', (req, res) => {
    return res.render('register')
})

function verificarToken(req, res, next) {
    const token = req.cookies.cookieJWT || null
    
    if (token) {
        
        res.locals.auth = true
        
        next()
    }
    else {
        res.locals.auth = false
        next()
    }
}

export default router



