const { Sequelize } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize for PostgreSQL
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    port: process.env.DATABASE_PORT,
    logging: false,
  }
);

// Test connection
sequelize
  .authenticate()
  .then(() => console.log("PostgreSQL Connected"))
  .catch((err) => console.log("Database Connection Error:", err));

module.exports = sequelize;
