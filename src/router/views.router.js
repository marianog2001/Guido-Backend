import { Router } from 'express'


//adminCoder@coder.com
//adminCod3r123)


const router = Router()




router.get('/', async (req, res) => {
    return res.render('index')
})

router.get('/login', (req, res) => {
    return res.render('login')
})

router.get('/register', (req, res) => {
    return res.render('register')
})


export default router



