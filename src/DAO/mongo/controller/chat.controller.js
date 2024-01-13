/* import { Router } from "express"

const router = Router()

router.get("/", (req,res) => {
	res.render("chat",{})
})

export default router */

export const chatRender = (req,res) => {
    res.render("chat",{})
}