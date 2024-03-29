import passport from 'passport'
import passportJWT from 'passport-jwt'
import local from 'passport-local'
import GithubStrategy from 'passport-github2'

import { createHash, passwordValidator, generateToken, verifyToken } from './auth.services.js'
import { logger } from './logger.services.js'
import { UserService, CartService } from '../repositories/index.js'

// env config

import { githubClientID, githubSecret, jwtSecret } from './environment.services.js'
import UserInsertDTO from '../DTO/user.dto.js'


// --------------------

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
                logger.error('user already exists')
                return done(null, false, { message: ' user already exists ' })
            }

            const newUserCart = await CartService.createCart()

            logger.debug(newUserCart._id)
            const newUser = new UserInsertDTO({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
                cartId: newUserCart._id
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

                if (!UserService.checkExistence(username)) {
                    logger.error('user doesnt exist!')
                    return done(null, false)
                }

                const user = await UserService.getUser(username)

                if (!passwordValidator(user, password)) {
                    logger.error('password not valid')
                    return done(new Error('password not valid'), false)
                }

                const token = generateToken(user)
                user.token = token

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
        logger.debug(profile)

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

    //JWT

    passport.use('jwt',
        new JWTStrategy(
            {
                jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([(req) => {
                    const token = req?.cookies?.cookieJWT ?? null
                    return token
                }
                ]),
                secretOrKey: jwtSecret,
            },

            (jwtPayload, done) => {
                // Verificar si jwtPayload es válido
                /* if (!jwtPayload) {
                    return done(null, false, { message: 'Token inválido' })
                } */
                // Si el token es válido, pasa el usuario autenticado
                
                return done(null , jwtPayload)
            }
        ))

    // Serialization
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await UserService.getUserByID(id)
        done(null, user)
    })
}

export default initializePassport
