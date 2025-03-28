const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sequelize = require("./config/database");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Sync Database
sequelize.sync()
    .then(() => console.log("Database Synced"))
    .catch(err => console.log("Sync Error:", err));

app.use("/events", require("./routes/eventRoutes"));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Event Service running on port ${PORT}`));
