require('dotenv').config();

module.exports = {
  development: {
    use_env_variable: "PSQL_DATABASE_URL_DEVELOPMENT",
    dialect: "postgres",
  },
  test: {
    use_env_variable: "PSQL_DATABASE_URL_TEST",
    dialect: "postgres",
  },
  production: {
    use_env_variable: "PSQL_DATABASE_URL_PRODUCTION",
    dialect: "postgres",
  },
};
