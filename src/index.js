const app = require('./app');
const routes = require('./routes');
const apiRoutes = require('./apiRoutes');

app.use('/', routes); // Rutas "/"
app.use('/api', apiRoutes); // Rutas "/api"

const server = app.listen(process.env.NODE_DOCKER_PORT, () => {
  server.timeout = 0;
  console.log(`Servidor en ejecución en puerto ${process.env.NODE_LOCAL_PORT}`);
});

module.exports = app;