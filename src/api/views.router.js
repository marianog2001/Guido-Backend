import { Router } from "express"

const router = Router()

//--------------- MIDDLEWARES ----------------
function onlyPublicWithoutSession(req,res,next) {
    if (req.session?.user) return res.redirect('/profile')

    return next()
}

function auth(req,res,next) {
    if(req.session?.user) return next()

    res.redirect('/login')
}

function userData(req,res,next) {
    const user = req.session.user || null
    res.locals.user = user
    next()
}

//------------------------------------------

router.get('/', userData, async(req,res) => {
    try {
        res.render('index')
    } catch (err) {
        res.send('an error has occurred')
        console.log(err)
    }
})

router.get('/login', onlyPublicWithoutSession, (req,res) => {
    return res.render('login')
})

router.get('/register', onlyPublicWithoutSession, (req,res) => {
    return res.render('register')
})

router.get('/profile', auth, (req,res) => {
    const user = req.session.user
    
    res.render('profile',user)
})

//adminCoder@coder.com
//adminCod3r123)



export default router


    
