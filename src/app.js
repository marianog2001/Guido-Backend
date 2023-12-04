import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import session from 'express-session'

// import FileStore from 'session-file-store'
import MongoStore from 'connect-mongo'

import chatRouter from './api/chat.router.js'
import viewsRouter from "./api/views.router.js"
import productRouter from "./api/products.router.js"
import cartRouter from "./api/cart.router.js"
import messageModel from './DAO/models/message.model.js'
import sessionRouter from './api/session.router.js'

//express config
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static('./public'))
app.use('/api/static', express.static('./public'));


//-------------------------------------


//config handlebars
app.engine('handlebars', handlebars.engine()) //Inicio motor de plantillas
app.set('views', './src/views') //Indicamos donde estan las vistas
app.set('view engine', 'handlebars') //Indicamos motor que usarán las vistas
//--------------------------------------


//mongoose config
const url = "mongodb+srv://marianog2001:6pvmodo6doiRze65@cluster0.3wxdcut.mongodb.net/"

mongoose.connect(url, { dbName: 'ecommerce' })
    .then(() => {
        console.log('db connected succesfully')
        const httpServer = app.listen(8080, () => { console.log('server running') })
        const socketServer = new Server(httpServer)
        app.set('socketio', socketServer);
        socketServer.on('connection', async socket => {
            console.log('New client connected')

            let messageLogs = await messageModel.find().lean().exec() || []
            socket.emit('logs', messageLogs)

            socket.on('emit message', async newMessage => {
                let result = await messageModel.create(newMessage)
                socketServer.emit('render message', newMessage)
            })

            socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        })
    }
    )
    .catch(
        (e) => {
            console.error('db failed to connect:' + e)
        }
    )
//--------------------------------------

//login
// const fileStore = FileStore(session) -----file storage


app.use(session({

    store: MongoStore.create({
        mongoUrl:url,
        dbName:'ecommerce',
        mongoOptions:{
            useNewUrlParser:true,
            useUnifiedTopology:true
        }
    }),

    // file storage
    /* store: new fileStore({
        path:'./sessions',
        retries:2
    }), */


    secret:'secret',
    resave:true, //mantiene sesion activa
    saveUninitialized:true //Guarda los datos
}))

//-----------------------------------------

//config rutas
app.use('/', viewsRouter)

app.use('/api/session', sessionRouter)

app.use("/api/products", productRouter)

app.use("/api/carts", cartRouter)

app.use("/chat", chatRouter)
//--------------------------------------

