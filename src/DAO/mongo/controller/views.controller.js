
/* router.get("/",

    async (req, res) => {
        res.render("index")
    })
 */

export const home = (req, res) => {
    return res.render("index")
}


/* router.get("/login", (req, res) => {
    return res.render("login")
})
*/

export const logScreen = (req, res) => {
    return res.render("login")
}

export const regScreen = (req, res) => {
    return res.render("register")
}


/* 
router.get("/register", (req, res) => {
    return res.render("register")
})  */

//adminCoder@coder.com
//adminCod3r123)

