const amqp = require("amqplib");
require("dotenv").config();

const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
const QUEUE_NAME = process.env.RABBITMQ_QUEUE;

async function publishEventNotification(event) {
    try {
        const conn = await amqp.connect(RABBITMQ_URL);
        const channel = await conn.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });

        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(event)), { persistent: true });
        console.log(`Event notification sent to RabbitMQ: ${JSON.stringify(event)}`);

        setTimeout(() => conn.close(), 500);
    } catch (error) {
        console.error("RabbitMQ Error:", error);
    }
}

module.exports = { publishEventNotification };
