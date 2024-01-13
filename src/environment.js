/* eslint-disable no-undef */

import { config } from "dotenv"

config({ path: "./.env" })

const port = process.env.PORT || 8080
const url = process.env.MONGO_URL
const dbName = process.env.MONGO_DBNAME
const githubClientID = process.env.GITHUB_CLIENT_ID
const githubSecret = process.env.GITHUB_SECRET
const jwtSecret = process.env.JWT_SECRET

export { port, url, dbName, githubClientID, githubSecret, jwtSecret }