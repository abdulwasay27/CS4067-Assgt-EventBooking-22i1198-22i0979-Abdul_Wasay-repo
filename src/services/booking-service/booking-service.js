const express = require("express");
const pool = require("./postgres-database");
const amqp = require("amqplib");
const jwt = require("jsonwebtoken");
const axios = require("axios");
require("dotenv").config();

const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || "http://localhost:5002"; 
const rabbitmq_host = process.env.RABBITMQ_HOST;
const rabbitmq_port = process.env.RABBITMQ_PORT;
const rabbitmq_user = process.env.RABBITMQ_USER;
const rabbitmq_password = process.env.RABBITMQ_PASSWORD;
const queue_name = "booking_notifications";
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; 

const app = express();
const PORT = 3001;
app.use(express.json());



app.get("/", (req, res) => {
    res.send("Hello, Node.js Server!");
});

async function checkEventValidity(eventId) {
    try {
        const response = await axios.get(`${EVENT_SERVICE_URL}/events/${eventId}`);    
        return response.data && response.data;
    } catch (error) {
        console.error("Error checking event validity:", error.message);
        return false;
    }
}

async function checkUserBooking(userData) {
    try {
        const result = await pool.query(
            "select 1 from booking where email=$1 and event_id=$2",
            [userData["email"], userData["event_id"]]
        );
        if (result.rows.length > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error("Error while checking duplicate booking: " + error.message);
    }
}

async function createBooking(credentials) {
    try {
        await pool.query(
            "insert into booking(email, event_id, num_tickets) values ($1, $2, $3)",
            [credentials["email"], credentials["event_id"], credentials["num_tickets"]]
        );
        const result = await pool.query(
            "select booking_id from booking where email = $1 and event_id = $2",
            [credentials["email"], credentials["event_id"]]
        );
        const booking_id = result.rows[0].booking_id;
        return parseInt(booking_id, 10);
    } catch (error) {
        throw new Error("Error while creating booking: " + error.message);
    }
}

async function publishBooking(booking_id, email, status) {
    try {
        const conn = await amqp.connect(
            `amqp://${rabbitmq_user}:${rabbitmq_password}@${rabbitmq_host}:${rabbitmq_port}`
        );
        const channel = await conn.createChannel();
        await channel.assertQueue(queue_name, { durable: true });
        const message = {
            booking_id: booking_id,
            user_email: email,
            status: status
        };
        channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(message)), { persistent: true });
        setTimeout(() => {
            conn.close();
        }, 500);
    } catch (error) {
        console.error("Error confirming booking:", error);
        throw new Error("Error while publishing event to rabbitmq: " + error.message);
    }
}

async function getUserBookings(email) {
    try {
        const result = await pool.query("SELECT * FROM booking WHERE email = $1", [email]);
        return result.rows;
    } catch (error) {
        throw new Error("Error retrieving user bookings: " + error.message);
    }
}

app.post("/book", async (req, res) => {
    try {
        const { email, event_id, tickets } = req.body;
        
        if (!email || !event_id || !tickets) {
            return res.status(400).json({ message: "All fields required!" });
        }
        const eventIsValid = await checkEventValidity(event_id);
        if (!eventIsValid) {
            return res.status(400).json({ message: "Invalid event!" });
        }

        const duplicateBooking = await checkUserBooking({ email: email, event_id: event_id });
        if (duplicateBooking) {
            return res.status(400).json({ message: "Duplicate booking is not allowed!" });
        } else {
            const booking_id = await createBooking({ email: email, event_id: event_id, num_tickets: tickets });
            await publishBooking(booking_id, email, "CONFIRMED");
            res.status(200).json({ message: "Booking Successful!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
app.post("/book/allUserBookings", async (req, res) => {
    const { email } = req.body;
    
    try {
        const bookings = await getUserBookings(email);
        return res.status(200).json({ message: "All user bookings", bookings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

app.get("/book/userEventBooking", async (req, res) => {
    const { email, eventId } = req.params;
    try {
      const result = await pool.query(
        "SELECT * FROM booking WHERE email = $1 AND event_id = $2",
        [email, eventId]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "No booking found" });
      }
      return res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error("Error retrieving booking:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});