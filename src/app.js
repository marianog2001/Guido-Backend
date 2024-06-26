import express from 'express'
import passport from 'passport'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import initializePassport from './services/passport.services.js'
import __dirname from './folder.services.js'

import cartRouter from './router/cart.router.js'
import chatRouter from './router/chat.router.js'
import productsRouter from './router/products.router.js'
import userRouter from './router/user.router.js'
import viewsRouter from './router/views.router.js'
import paymentRouter from './router/payment.router.js'
import mockRouter from './router/mock.router.js'

import { port } from './services/environment.services.js'
import { MessageService } from './repositories/index.js'
import compression from 'express-compression'

import { errorHandler } from './services/errorHandler.services.js'
import swaggerJSDoc from 'swagger-jsdoc'
import SwaggerUiExpress from 'swagger-ui-express'

// express config
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(compression({ brotli: { enabled: true, zlib: {} } }))
app.use(errorHandler)
app.use(cookieParser())
app.use(express.static(__dirname + '/public'))

// Passport
initializePassport()
app.use(passport.initialize())

// Handlebars


app.engine('handlebars', engine({
    extname: 'handlebars',
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
        allowProtoGettersAndSetters: true,
        allowProtoDecorators: true
    }
}))

app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

// Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion API de Groove Market',
            description: 'Tienda de instrumentos y accesorios musicales'
        }
    },
    apis: [`${__dirname}/docs/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs))

// Socket.io
const httpServer = app.listen(port, () => { console.log('SERVER RUNNING ON PORT: ' + port) })
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
        await MessageService.createMessage(newMessage)

        io.emit('render message', newMessage)
    })
    socket.on('error', (error) => {
        console.error('Socket error: ' + error)
    })
})


// Rutas

app.use('/', viewsRouter)
app.use('/api/cart', cartRouter)
app.use('/api/chat', chatRouter)
app.use('/api/session', userRouter)
app.use('/api/products', productsRouter)
app.use('/api/payments', paymentRouter)

app.use('/mocks', mockRouter)




