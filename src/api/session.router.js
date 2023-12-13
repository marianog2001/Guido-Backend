import { Router } from "express"
import userModel from "../DAO/models/user.model.js"
import { passwordValidator } from "../utils.js"
import passport from "passport"


const router = Router()

router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) return res.send(error)
    })
    return res.redirect('/')
})

router.post(
    '/login',
    passport.authenticate('login', {
        failureRedirect: '/'
    }),
    async (req, res) => {
        if (!req.user) return res.status(404).send('invalid credentials')

        req.session.user = req.user
        return res.status(200).send('logged!')
    }
)

router.post(
    '/register',
    passport.authenticate('register', {
        failureRedirect: '/'
    }),

    async (req, res) => {
        res.send('registered!')
    })


router.get('/github',
    passport.authenticate('github', { scope: ['user:email'] }),
    (req, res) => {
    })

router.get('/githubcallback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    async (req, res) => {
        console.log('callback: ' + req.user)

        req.session.user = req.user
        console.log('user setted')

        return res.redirect('/')
    }
)


export default router