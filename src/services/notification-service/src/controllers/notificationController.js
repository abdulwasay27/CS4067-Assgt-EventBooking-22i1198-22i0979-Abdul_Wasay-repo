const Notification = require("../models/notificationModel");

// Store a new notification
exports.createNotification = async (req, res) => {
    const { email, event_name } = req.body;
    if (!email || !event_name) {
        return res.status(400).json({ error: "Missing email or event name" });
    }

    try {
        const notification = await Notification.create({ email, event_name });
        res.json({ message: "Notification stored successfully!", notification });
    } catch (error) {
        console.error("Error storing notification:", error);
        res.status(500).json({ error: "Database error" });
    }
};

// Fetch all notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Database error" });
    }
};
