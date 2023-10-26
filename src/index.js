import express from "express"
import pg from "pg"
import { config } from "dotenv";
config()

const app = express()
new pg.Pool({
    connectionString: process.env.PSQL_DATABASE_URL,
    // ssl: true
})

app.get('/', (req, res) => {
    res.send('Holaa Mundo de Desarrollo de Software!')
})

app.get('/ping', async (req, res) => {
    const result = await pool.query('SELECT NOW()')
    return res.json(result.rows[0])
})

app.listen(process.env.NODE_DOCKER_PORT)
console.log('Server on Port', process.env.NODE_LOCAL_PORT)