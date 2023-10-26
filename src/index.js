import express from "express"
import { config } from "dotenv";
config()

const app = express()

app.get('/', (req, res) => {
    res.send('Holaa Mundo!')
})

app.listen(process.env.NODE_DOCKER_PORT)
console.log('Server on Port', process.env.NODE_LOCAL_PORT)