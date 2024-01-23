import passport from 'passport'
import passportJWT from 'passport-jwt'
import local from 'passport-local'
import GithubStrategy from 'passport-github2'

import { createHash, passwordValidator, generateToken } from '../utils.js'

import { UserService, CartService } from '../repositories/index.js'

// env config

import { githubClientID, githubSecret, jwtSecret } from '../environment.js'
import UserInsertDTO from '../DTO/user.dto.js'




const LocalStrategy = local.Strategy

const JWTStrategy = passportJWT.Strategy

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email',
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body

        try {

            if (await UserService.checkExistence(email)) {
                console.log('user already exists')
                return done(null, false, { message: ' user already exists ' })
            }

            const newUserCart = await CartService.createCart()
            console.log(newUserCart)
            const newUser = new UserInsertDTO({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cartId: newUserCart.id
            })

            const result = await UserService.createUser(newUser)
            const token = generateToken(result)
            result.token = token

            return done(null, result)
        } catch (e) {
            done(e)
        }
    }))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                /* console.log(username + '    -- ' + password) */
                const user = await UserService.getUser(username)
                if (!UserService.checkExistence(username)) {
                    console.log('user doesnt exist!')
                    return done(null, false)
                }

                if (!passwordValidator(user, password)) {
                    console.log('password not valid')
                    return done(null, false)
                }

                return done(null, user)
            } catch (error) {
                return done('error on login: ' + error)
            }
        },
    ))

    passport.use('github', new GithubStrategy({
        clientID: githubClientID,
        clientSecret: githubSecret,
        callbackURL: 'http://127.0.0.1:8080/api/session/githubcallback',
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile)

        try {
            const user = await UserService.getUser({ email: profile._json.email })
            
            //case of user existing:
            if (user) {
                const token = generateToken(user)
                user.token = token
                return done(null, user)
            }


            //case of github register:
            const newUserCart = await CartService.createCart()

            const newUser = new UserInsertDTO({
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                age: '',
                password: '',
                cartId: newUserCart._id,
            })

            const token = generateToken(newUser)
            newUser.token = token

            return done(null, newUser)
        } catch (e) {
            return done(`error on github log:${e}`)
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([(req) => req?.cookies?.cookieJWT ?? null]),
        secretOrKey: jwtSecret,
    }, (jwt_payload, done) => {
        done(null, jwt_payload)
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserService.getUserByID(id)
        done(null, user)
    })
}

export default initializePassport
