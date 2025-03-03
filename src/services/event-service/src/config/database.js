const { Sequelize } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize for PostgreSQL
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: process.env.DB_PORT,
        logging: false,
    }
);

// Test connection
sequelize.authenticate()
    .then(() => console.log("PostgreSQL Connected"))
    .catch(err => console.log("Database Connection Error:", err));

module.exports = sequelize;
