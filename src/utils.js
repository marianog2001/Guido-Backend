import { fileURLToPath } from "url"
import { dirname } from "path"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)



export default __dirname

export const createHash = (password) => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const passwordValidator = (user, password) => {
	return bcrypt.compareSync(password, user.password)
}


//jwt
export const generateToken = (user) => {
	const token = jwt.sign({ user }, "coderTokenForJWT", { expiresIn: "24h" })

	return token
}