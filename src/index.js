/* eslint-disable no-undef */
const express = require('express');
const pg = require('pg');

require('dotenv').config();

const app = express()
const pool = new pg.Pool({
    connectionString: process.env.PSQL_DATABASE_URL,
    //ssl: true
})

app.get('/', (req, res) => {
    res.send('Hola mundo esto es una demo!')
})

app.get('/cinemas', async (req, res) => {
    const result = await pool.query('SELECT name, ST_AsText(location) FROM cinemas')
    return res.json(result.rows)
})

app.listen(process.env.NODE_DOCKER_PORT)
console.log('Server on Port', process.env.NODE_LOCAL_PORT)

module.exports = app;