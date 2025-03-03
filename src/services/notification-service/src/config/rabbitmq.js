const amqp = require("amqplib");
require("dotenv").config();
const { storeNotification } = require("../services/notificationService");

const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
const QUEUE_NAME = process.env.RABBITMQ_QUEUE;

async function listenForNotifications() {
    try {
        const conn = await amqp.connect(RABBITMQ_URL);
        const channel = await conn.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        console.log("Listening for event notifications...");
        channel.consume(QUEUE_NAME, async (msg) => {
            if (msg !== null) {
                const event = JSON.parse(msg.content.toString());
                console.log(`Received Event: ${JSON.stringify(event)}`);

                await storeNotification(event);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error("RabbitMQ Listener Error:", error);
    }
}

module.exports = { listenForNotifications };
