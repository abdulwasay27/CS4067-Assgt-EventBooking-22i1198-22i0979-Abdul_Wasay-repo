const express = require("express");
const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors()); 


const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; 

// Define your microservices' base URLs

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://localhost:3000";
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || "http://localhost:3001";
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || "http://localhost:3002";

app.post("/user/signup", async (req, res) => {
    // Forward request to user service for sign-up
    const targetUrl = `${USER_SERVICE_URL}/signup`;
    console.log("hello")
    try {
        const response = await axios.post(targetUrl, req.body);
        res.status(response.status).send(response.data);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).send(error.response.data);
      } else {
        res.status(500).send({ message: "Error contacting user service" });
      }
    }
});

app.post("/user/login", async (req, res) => {
    // Forward request to user service for login
    const targetUrl = `${USER_SERVICE_URL}/login`;
    try {
      const response = await axios.post(targetUrl, req.body);
      res.status(response.status).send(response.data);
    } catch (error) {
      if (error.response) {
          res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send({ message: "Error contacting user service" });
        }
    }
});

// JWT verification middleware 
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}


app.use(verifyToken);

// Forward requests to the user service
app.all("/user/*", async (req, res) => {
  const targetUrl = `${USER_SERVICE_URL}${req.originalUrl.replace("/user", "")}`;
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ message: "Error contacting user service" });
    }
  }
});

// Forward requests to the booking service
app.all("/booking/*", async (req, res) => {
  const targetUrl = `${BOOKING_SERVICE_URL}${req.originalUrl.replace("/booking", "/book")}`;
  
  try {
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send({ message: "Error contacting booking service" });
    }
  }
});

app.all("/events/*", async (req, res) => {
    const targetUrl = `${EVENT_SERVICE_URL}${req.originalUrl}`;
    
    try {
        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers: { Authorization: req.headers.authorization },
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(500).send({ message: "Error contacting event service" });
        }
    }
});

// Start the API Gateway
const GATEWAY_PORT = process.env.GATEWAY_PORT || 8080;
app.listen(GATEWAY_PORT, () => {
  console.log(`API Gateway running on http://localhost:${GATEWAY_PORT}`);
});