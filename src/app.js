import express from 'express'
import productRouter from "./api/products.router.js"
import cartRouter from "./api/cart.router.js"
import multer from 'multer'
import handlebars from 'express-handlebars'
import viewsRouter from "./api/views.router.js"
import __dirname from './utils.js'
import { Server } from 'socket.io'

const app = express()


const httpServer = app.listen(8080, () => { console.log('server running') })
const socketServer = new Server(httpServer)

app.set('socketio', socketServer);
app.use(express.json())
app.use('/static', express.static('./src/public'))

// multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public') //Donde se guarda el archivo
    },
    filename: function (req, file, cb) {
        cb(null, file.originalName + '_' + new Date().getTime()) //Funcion que le añade la fecha al nombre del archivo
    }
})
const uploader = multer({ storage })

app.engine('handlebars', handlebars.engine()) //Inicio motor de plantillas
app.set('views', './src/views') //Indicamos donde estan las vistas
app.set('view engine', 'handlebars') //Indicamos motor que usarán las vistas






app.use('/', viewsRouter)

app.use("/api/products", productRouter)

app.use("/api/carts", cartRouter)





socketServer.on('connection', socket => {
    console.log('New client connected')

    socket.on('message', data => {
        console.log(data)
    })
})

