import passport from "passport"

import passportJWT from "passport-jwt"
import local from "passport-local"
import GithubStrategy from "passport-github2"
import userModel from "../DAO/mongo/models/user.model.js"
import cartModel from "../DAO/mongo/models/cart.models.js"
import { createHash, passwordValidator, generateToken } from "../utils.js"


// env config

import { githubClientID, githubSecret, jwtSecret } from "../environment.js"




const LocalStrategy = local.Strategy

const JWTStrategy = passportJWT.Strategy

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email",
    }, async (req, username, password, done) => {
        const {
            first_name, last_name, email, age,
        } = req.body

        try {
            const user = await userModel.findOne({ email: username })
            if (user) {
                console.log("user already exists")
                return done(null, false, { message: " user already exists " })
            }

            const newUserCart = new cartModel()
            newUserCart.save()

            const newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cartId: newUserCart._id,
            }

            const result = await userModel.create(newUser)

            return done(null, result)
        } catch (e) {
            done(e)
        }
    }))

    passport.use("login", new LocalStrategy(
        { usernameField: "email" },
        async (username, password, done) => {
            try {
                /* console.log(username + ' -- ' + password) */
                const user = await userModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.log("user doesnt exist!")
                    return done(null, false)
                }

                if (!passwordValidator(user, password)) {
                    console.log("password not valid")
                    return done(null, false)
                }

                return done(null, user)
            } catch (e) {
                return done(`login error ${e}`)
            }
        },
    ))

    passport.use("github", new GithubStrategy({
        clientID: githubClientID,
        clientSecret: githubSecret,
        callbackURL: "http://127.0.0.1:8080/api/session/githubcallback",
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile)

        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if (user) {
                const token = generateToken(user)
                user.token = token
                //----------------

                return done(null, user)
            }

            const newUserCart = new cartModel()
            newUserCart.save()

            const newUser = await userModel.create({
                first_name: profile._json.name,
                last_name: "",
                email: profile._json.email,
                age: "",
                password: "",
                cartId: newUserCart._id,
            })

            const token = generateToken(newUser)
            newUser.token = token

            return done(null, newUser)
        } catch (e) {
            return done(`error on github log:${e}`)
        }
    }))

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([(req) => req?.cookies?.cookieJWT ?? null]),
        secretOrKey: jwtSecret,
    }, (jwt_payload, done) => {
        done(null, jwt_payload)
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport
