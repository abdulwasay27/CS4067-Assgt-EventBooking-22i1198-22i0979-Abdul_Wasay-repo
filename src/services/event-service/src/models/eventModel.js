const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

// Define Event Model (Matches Database Schema)
const Event = sequelize.define("Event", {
    event_id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    location: { 
        type: DataTypes.STRING, 
        allowNull: false 
    }
}, { 
    timestamps: false,
    tableName: "event" // Ensure Sequelize uses correct table name
});

module.exports = Event;
