const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const { listenForNotifications } = require("./config/rabbitmq"); 

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sync Database
sequelize.sync()
    .then(() => console.log("Database Synced"))
    .catch(err => console.log("Sync Error:", err));

listenForNotifications();  

app.use("/notifications", require("./routes/notificationRoutes"));

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log("Notification Service running on port ${PORT}"));