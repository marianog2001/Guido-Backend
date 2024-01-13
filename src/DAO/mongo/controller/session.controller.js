import passport from "passport"
import { generateToken } from "../../../utils.js"

/* router.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        res.send(error)
    })
    return res.redirect("/")
}) */

export const sessionLogout = async (req, res) => {
    res.cookie.destroy("cookieJWT").send()
} 


export const sessionLogin = async (req, res) => {
    await passport.authenticate("login", {
        session: false,
        failureRedirect: "error",
        failureMessage: true,
    })
    const { user } = req
    const token = generateToken(user)

    res.cookie("cookieJWT", token)

    return res.redirect("/")
}

/* router.post(
    "/login",
    passport.authenticate("login", {
        session: false,
        failureRedirect: "error",
        failureMessage: true,
    }),
    async (req, res) => {
        const { user } = req
        const token = generateToken(user)

        res.cookie("cookieJWT", token)

        return res.redirect("/")
    },
) */

//---------------------
export const sessionRegister = (req,res) => {
    passport.authenticate("register", {
        session: false,
        failureMessage: true,
    })
    res.send("registered")
}

/* router.post(
    "/register",
    passport.authenticate("register", {
        session: false,
        failureMessage: true,
    }),

    (req, res) => {
        res.send("registered!")
    },
) */
//---------------------

// error

export const errorRedirect = (req, res) => {
    const error = req?.query ?? "server error"
    console.error(error)
    res.render("errors/errorPage", {
        status: "error",
        error,
    })
}

/* router.get("/error", (req, res) => {
    const error = req?.query ?? "server error"
    console.error(error)
    res.render("errors/errorPage", {
        status: "error",
        error,
    })
}) */

//profile

export const sessionProfile = (req, res) => {
    passport.authenticate("jwt", { session: false })
    const { user } = req.user
    res.render("profile", user)
}

/* router.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { user } = req.user
        res.render("profile", user)
    },
) */

// github
/* router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    () => {
    },
)

router.get(
    "/githubcallback",
    passport.authenticate("github", { failureRedirect: "/login" }),
    async (req, res) => {
        if (!req.user) {
            return res.status(500).send({ message: "invalid github" })
        }
        res.cookie("cookieJWT", req.user.token)

        return res.redirect("/")
    },
) */

//si no anda probar con el req,res !!!!!
export const sessionGithubLogin = async () => {
    passport.authenticate("github",{scope:["user:email"]})
}

export const sessionGithubCallback = async (req, res) => {
    passport.authenticate("github", { failureRedirect: "/login" })
    if (!req.user) {
        return res.status(500).send({message: "invalid github"})
    }
    res.cookie("cookieJWT", req.user.token)
    return res.redirect
}
