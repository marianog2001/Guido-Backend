import express from 'express'

import passport from 'passport'

import {engine} from 'express-handlebars'

import { Server } from 'socket.io'

import session from 'express-session'

import cookieParser from 'cookie-parser'

import initializePassport from './config/passport.config.js'

import __dirname from './utils.js'

import cartRouter from './router/cart.router.js'

import chatRouter from './router/chat.router.js'

import productsRouter from './router/products.router.js'

import userRouter from './router/user.router.js'

import viewsRouter from './router/views.router.js'

import mockRouter from './router/mock.router.js'

import { errorHandler } from './utils.js'

// import MongoStore from "connect-mongo"


import { port } from './environment.js'
import { MessageService } from './repositories/index.js'
import compression from 'express-compression'
import { addLogger, logger } from './logger.js'




// express config

const app = express()

app.use(express.json())

app.use(compression({
    brotli: {enabled:true, zlib: {}}
}))

app.use(express.urlencoded({ extended: true }))

app.use(errorHandler)

//router

app.use('/', viewsRouter)

app.use('/api/cart', cartRouter)

app.use('/api/chat', chatRouter)

app.use('/api/session' , userRouter)

app.use('/api/products', productsRouter)

app.use('/mocks',mockRouter)




app.use(express.static(__dirname + '/public'))

/* app.use('/static', express.static('./public'))
 */
/* app.use('/api/static', express.static('./public')) */

//server
const httpServer = app.listen(port, () => { logger.info('SERVER RUNNING ON PORT: ' + port) })

// config handlebars

app.engine('handlebars', engine({
    extname: 'handlebars',
    defaultLayout: 'main',
    /* layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials', */
}))
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// socketio and message config



export const io = new Server(httpServer)

app.set('socketio', io)

io.on('connection', async (socket) => {

    /* logger.info('New client connected') */

    try {
        const messageLogs = await MessageService.getMessages()
        socket.emit('logs', messageLogs)
    } catch (error) {
        console.error('error fetching data: ' + error)
    }
    socket.on('emit message', async (newMessage) => {
        
        const result = await MessageService.createMessage(newMessage)
        io.emit('render message', result)
    })
    socket.on('error', (error) => {
        console.error('Socket error: ' + error)
    })
})


//session

app.use(session({

    /* store: MongoStore.create({

          mongoUrl:url,

          dbName:'ecommerce',

          mongoOptions:{

              useNewUrlParser:true,

              useUnifiedTopology:true

          }

      }), */

    // file storage

    /* store: new fileStore({

          path:'./sessions',

          retries:2

      }), */

    secret: 'secret',

    resave: true, // mantiene sesion activa

    saveUninitialized: true, // Guarda los datos

}))

// passport

initializePassport()

app.use(passport.initialize())

app.use(cookieParser('secretCookie'))

//handler de '/*' para que el response status 304 no impida la carga del root
app.get('/*', function(req, res, next){ 
    res.setHeader('Last-Modified', (new Date()).toUTCString())
    next() 
})

//ruta de prueba de logger

app.use(addLogger)

app.get('/test', (req, res) => {

    
    req.logger.debug('debug')
    
    req.logger.http('http')
    req.logger.info('info')
    req.logger.warning('warn')
    req.logger.error('error')

    res.send('ok!')
})



