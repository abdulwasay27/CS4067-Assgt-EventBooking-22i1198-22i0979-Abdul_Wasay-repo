const express = require('express');
const bcrypt = require('bcrypt');
const pool = require("./postgres-database")


const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, Node.js Server!");
    fetchAllUsers().then((data)=>{
        console.log(data.rows);
    });
});

async function fetchAllUsers(){
    const result = await pool.query("Select * from users");
    return result;
}

async function checkUserExists(email){
    try{
        const result = await pool.query("select 1 from users where email = $1", [email])
        if(result.rows.length > 0){
            return true
        }
        else{
            return false
        }
    }
    catch(error){
        throw new Error("Database error while checking user existence: " + error.message);
    }
}
async function storeUser(credentials){
    try{
        await pool.query("insert into users(email, password) values ($1, $2)", [credentials["email"], credentials["pass"]]);
        return true;
    }
    catch(error){
        throw new Error("Error storing user data: "+ error.message)
    }
}
app.post("/user", async (req, res) =>{
    try{
        console.log(req.body)
        const {email, password} = req.body
        if (!email || !password){
            res.status(400).json({message:"Email and password required."});
            return;
        }
        const userExists = await checkUserExists(email)
        if(userExists){
            console.log("User already exists!")
            res.status(400).json({ message: "The user already exists" });
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            storeUser({"email": email, "pass": hashedPassword})
            res.status(201).json({ message: "User registered successfully!" });
        }
    }
    catch(error){
        console.log(error.body)
        res.status(500).json({ message: "Internal Server Error" });
    }
})

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});