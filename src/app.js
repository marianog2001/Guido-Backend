import express from "express"

import mongoose from "mongoose"

import passport from "passport"

import handlebars from "express-handlebars"

import { Server } from "socket.io"

import session from "express-session"

import cookieParser from "cookie-parser"

import initializePassport from "./config/passport.config.js"

import __dirname from "./utils.js"

import router from "./router/router.js"

import messageModel from "./DAO/mongo/models/message.model.js"

// import MongoStore from "connect-mongo"


import { port, url, dbName } from "./environment.js"




// express config

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use("/static", express.static("./public"))

app.use("/api/static", express.static("./public"))

// config handlebars

app.engine("handlebars", handlebars.engine({

    extname: "handlebars",

    defaultLayout: "main",

    layoutsDir: `${__dirname}/views/layouts`,

    partialsDir: `${__dirname}/views/partials`,

})) // Inicio motor de plantillas

app.set("views", `${__dirname}/views`) // Indicamos donde estan las vistas

app.set("view engine", "handlebars") // Indicamos motor que usarán las vistas

// mongoose config

mongoose.connect(url, { dbName })

    .then(() => {

        console.log("db connected succesfully")

        const httpServer = app.listen(port, () => { console.log("server running") })

        const socketServer = new Server(httpServer)

        app.set("socketio", socketServer)

        socketServer.on("connection", async (socket) => {

            console.log("New client connected")

            try {
                const totalCount = await messageModel.countDocuments({})
                const totalPages = Math.ceil(totalCount / 10)
                const messageLogs = await messageModel.paginate({}, { limit: 10, page: totalPages })
                socket.emit("logs", messageLogs)
            } catch (error) {
                console.error("error fetching data: " + error)
            }
            socket.on("emit message", async (newMessage) => {
                await messageModel.create(newMessage)
                socketServer.emit("render message", newMessage)
            })
            socket.on("error", (error) => {
                console.error("Socket error:", error)
            })
        })
    })
    .catch(
        (e) => {
            console.error(`db failed to connect:${e}`)
        },
    )
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

    secret: "secret",

    resave: true, // mantiene sesion activa

    saveUninitialized: true, // Guarda los datos

}))

// passport

initializePassport()

app.use(passport.initialize())

app.use(cookieParser("secretCookie"))

//router

app.use("/",router)