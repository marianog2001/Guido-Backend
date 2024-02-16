import express from 'express'
import passport from 'passport'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import initializePassport from './config/passport.config.js'
import __dirname from './utils.js'

import cartRouter from './router/cart.router.js'
import chatRouter from './router/chat.router.js'
import productsRouter from './router/products.router.js'
import userRouter from './router/user.router.js'
import viewsRouter from './router/views.router.js'
import mockRouter from './router/mock.router.js'

import { port } from './environment.js'
import { MessageService } from './repositories/index.js'
import compression from 'express-compression'

import { errorHandler } from './utils.js'
import { addLogger, logger } from './logger.js'

// express config
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression({ brotli: { enabled: true, zlib: {} } }))
app.use(errorHandler)
app.use(cookieParser())
app.use(addLogger)
app.use(express.static(__dirname + '/public'))

// Passport
initializePassport()
app.use(passport.initialize())

// Handlebars
app.engine('handlebars', engine({
    extname: 'handlebars',
    defaultLayout: 'main',
}))
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// Socket.io
const httpServer = app.listen(port, () => { logger.info('SERVER RUNNING ON PORT: ' + port) })
export const io = new Server(httpServer)
app.set('socketio', io)
io.on('connection', async (socket) => {
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


// Ruta de prueba de logger
app.get('/test', (req, res) => {
    console.log(req.cookies)
    res.send('ok!')
})

// Rutas

app.use('/',viewsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/chat', chatRouter)
app.use('/api/session', userRouter)
app.use('/api/products', productsRouter)
app.use('/mocks', mockRouter)

// Middleware para evitar el response status 304
app.get('/*', function (req, res, next) {
    res.setHeader('Last-Modified', (new Date()).toUTCString())
    next()
})

