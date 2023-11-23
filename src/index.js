require('dotenv').config();
const app = require('./app');
const db = require("./config/db")

db.sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    app.listen(process.env.NODE_LOCAL_PORT, () => {
      console.log(`Servidor en ejecución en puerto ${process.env.NODE_LOCAL_PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  }
);