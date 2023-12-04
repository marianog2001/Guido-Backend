import { Router } from "express"
import userModel from "../DAO/models/user.model.js"

const router = Router()

router.get('/logout', (req,res) => {
    req.session.destroy(error => {
        if(error) return res.send(error)
    })
    return res.redirect('/')
})

router.post('/login', async (req,res) => {
    try {
        const {email , password} = await req.body // recordar que los parametros deben ser enviados por query
        
        const signedUser = await userModel.findOne({email:email})
        //invalidad cases
        if (!signedUser) { return res.status(401).json({error: 'email not registered'})}
        if (signedUser.password !== password ) { return res.status(401).json({error : ' wrong password '})}
        //---

        req.session.user = signedUser
    
        return res.redirect('/api/products')
    } catch (error) {
        console.error(error)
    }
})

router.post('/register' , async (req,res) => {
    try {
        const newUser = req.body
        if (!req.body.email || !req.body.password || !req.body.first_name || !req.body.last_name) return res.status(401).json({message: 'missing data'})
        const addUser = await userModel.create(newUser)
        return res.redirect('/login')
    } catch(e) {
        console.log(e)
        return res.status(500).json({error : "Server error"})
    }
})

router.get('logout', (req,res) => {
    req.session.destroy(err => {
        if (err) return res.send('logout error: '+e)

        return res.redirect('/')
    })
})



export default router