const Notification = require("../models/notificationModel");

async function storeNotification(event) {
    try {
        await Notification.create({
            email: "system@event.com",
            event_name: `New event added: ${event.name}`,
            status: "NEW"
        });
        console.log(`Notification stored for event: ${event.name}`);
    } catch (error) {
        console.error("Error storing notification:", error);
    }
}

module.exports = { storeNotification };
