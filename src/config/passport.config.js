import passport from "passport"
import local from "passport-local"
import GithubStrategy from "passport-github2"
import userModel from "../DAO/models/user.model.js"
import { createHash, passwordValidator } from "../utils.js"

const LocalStrategy = local.Strategy

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {

        const { first_name, last_name, email } = req.body

        try {

            const user = await userModel.findOne({ email: username })
            if (user) {
                console.log('user already exists')
                return done(null, false)
            }
            const newUser = {
                first_name,
                last_name,
                email,
                password: createHash(password)
            }
            const result = await userModel.create(newUser)
            return done(null, result)


        } catch (e) {
            done('error to register' + e)
        }

    }))

    passport.use('login', new LocalStrategy(
        { usernameField: 'email' },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username }).lean().exec()
                if (!user) {
                    console.log('user doesnt exist!')
                    return done(null, false)
                }

                if (!passwordValidator(user, password)) {
                    console.log('password not valid')
                    return done(null, false)
                }

                return done(null, user)
            } catch (e) {
                return done('login error ' + e)
            }
        }
    ))

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.64853d163bcac71e',
        clientSecret: '48d45ac8d2bc05faa1a6d8e76fb0cb076ae2c1c4',
        callbackURL: 'http://127.0.0.1:8080/api/session/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if (user) {
                console.log('already registered')
                return done(null, user)
            }
            const newUser = await userModel.create({
                first_name: profile._json.name,
                last_name: '',
                email: profile._json.email,
                password: ''
            })

            return done(null, newUser)

        } catch (e) {
            return done('error on github log:' + e)
        }
    })
    )

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initializePassport