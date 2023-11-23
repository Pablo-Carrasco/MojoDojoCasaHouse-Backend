require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: "PSQL_DATABASE_URL_DEVELOPMENT",
    dialect: "postgres",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "PSQL_DATABASE_URL_PRODUCTION",
    dialect: "postgres",
  },
};
