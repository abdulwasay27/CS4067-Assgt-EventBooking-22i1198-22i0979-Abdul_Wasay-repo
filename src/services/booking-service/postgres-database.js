const {Pool} = require("pg")
require('dotenv').config();

const pool = new Pool({
    user: process.env.DATABSE_USER,
  host: "localhost",
  database: process.env.DATABSE_NAME,
  password: process.env.DATABSE_PASSWORD,
  port: process.env.DATABASE_PORT
});

module.exports = pool;