require('dotenv').config();
const express = require("express");
const cors = require("cors");
const pg = require("pg");
pg.defaults.ssl = true;

const app = express();
const routes = require('./routes/index');

app.use(cors({
  origin: [process.env.URL_FRONTEND_PRODUCTION, process.env.URL_FRONTEND_DEVELOPMENT],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(routes)


module.exports = app;