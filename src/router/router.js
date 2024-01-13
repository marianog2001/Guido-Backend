import { Router } from "express"
import { chatRender } from "../DAO/mongo/controller/chat.controller.js"
import { getProducts, getOne, updateOne, deleteOne, createOne } from "../DAO/mongo/controller/products.controller.js"
import { getCart, createCart, addElementToCart, deleteCart, deleteElementFromCart, updateCartProductQuantity } from "../DAO/mongo/controller/cart.controller.js"
import { sessionGithubCallback, sessionGithubLogin, sessionLogin, sessionLogout, sessionRegister } from "../DAO/mongo/controller/session.controller.js"
import { home, logScreen, regScreen } from "../DAO/mongo/controller/views.controller.js"

const router = Router()

//chat
router.get("/chat", chatRender)


//products
router.get("/products", getProducts)
router.get("/products/:pid", getOne)
router.put("/products/:pid", updateOne)
router.delete("/products/:pid", deleteOne)
router.post("/products", createOne)

//cart

router.get("/cart/:cid", getCart)
router.post("/cart", createCart )
router.delete("/cart/:cid", deleteCart)
router.delete("/cart/:cid/products/:pid", deleteElementFromCart)
router.post("/cart/:cid/products/:pid", addElementToCart)
router.put("/cart/:cid/products/:pid", updateCartProductQuantity)

//session

router.post("/session/login", sessionLogin)
router.post("/session/logout", sessionLogout)
router.post("/session/register", sessionRegister)
router.post("/session/githubLogin", sessionGithubLogin)
router.post("/session/githubCallback", sessionGithubCallback)

//screens
router.get("/", home)
router.get("/login", logScreen)
router.get("/register", regScreen)

export default router