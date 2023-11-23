const express = require("express");
const cors = require("cors");
const pg = require("pg");
pg.defaults.ssl = true;

const app = express();
const routes = require('./routes/index');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(routes)


module.exports = app;