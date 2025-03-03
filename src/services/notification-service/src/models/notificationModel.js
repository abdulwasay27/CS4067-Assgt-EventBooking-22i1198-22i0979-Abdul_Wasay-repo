const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define("Notification", {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    event_name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    status: { 
        type: DataTypes.STRING, 
        defaultValue: "pending"
    },
    created_at: { 
        type: DataTypes.DATE, 
        defaultValue: DataTypes.NOW
    }
}, { 
    timestamps: false,
    tableName: "notification"
});

module.exports = Notification;
