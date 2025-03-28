const amqp = require("amqplib");
require("dotenv").config();

const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
const QUEUE_NAME = process.env.RABBITMQ_QUEUE || "booking_notifications";

async function listenForNotifications() {
  try {
    const conn = await amqp.connect(RABBITMQ_URL);
    const channel = await conn.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log(`Listening for messages on queue: ${QUEUE_NAME}...`);

    channel.consume(
      QUEUE_NAME,
      (msg) => {
        if (msg !== null) {
          const event = JSON.parse(msg.content.toString());
          console.log("Received Message:", event);
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("RabbitMQ Listener Error:", error);
  }
}

listenForNotifications();

module.exports = { listenForNotifications };
