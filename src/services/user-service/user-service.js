const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("./postgres-database");

const app = express();
const PORT = 3000;
const SECRET_KEY = "your_secret_key";

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, Node.js Server!");
  fetchAllUsers().then((data) => {
    console.log(data.rows);
  });
});

async function fetchAllUsers() {
  const result = await pool.query("SELECT * FROM users");
  return result;
}

async function checkUserExists(email) {
  try {
    const result = await pool.query("SELECT 1 FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows.length > 0;
  } catch (error) {
    throw new Error(
      "Database error while checking user existence: " + error.message
    );
  }
}

async function getUserByEmail(email) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Database error while fetching user: " + error.message);
  }
}

async function storeUser(credentials) {
  try {
    await pool.query("INSERT INTO users(email, password) VALUES ($1, $2)", [
      credentials.email,
      credentials.pass,
    ]);
    return true;
  } catch (error) {
    throw new Error("Error storing user data: " + error.message);
  }
}

app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }

    const userExists = await checkUserExists(email);
    if (userExists) {
      return res.status(400).json({ message: "The user already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await storeUser({ email, pass: hashedPassword });
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required." });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ email: user.email, userId: user.id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
