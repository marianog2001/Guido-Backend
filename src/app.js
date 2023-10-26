import express from 'express'
import productRouter from "./api/products.router.js"
import cartRouter from "./api/cart.router.js"


const app = express()

app.use(express.json())


app.use('/static', express.static('./src/public'))

app.get('/', (req,res) => {res.send('HERE IS HOME')})

app.use("/api/products",productRouter)

app.use("/api/carts",cartRouter)

app.listen(8080, () => {
    console.log('server running');
})



// multer config
/* const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./src/public')
    },
    filename: function(req,file,cb) {
        cb(null, file.originalName + '_' + new Date().getTime() )
    }
})
const uploader = multer({storage}) */