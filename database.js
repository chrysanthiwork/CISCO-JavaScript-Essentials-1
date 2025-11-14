import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host:process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getUsers(){
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
}

export async function getUser(id){
    const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`,[id])
    return rows
}

export async function createUser(name, email, age, city) {
    try {
        // check if email exists
        const [existing] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            // Αν υπάρχει, επιστρέφουμε μήνυμα ή 0 / null
            throw new Error("Email already exists");
        }

        // if doesnt exist then insert
        const [result] = await pool.query(
            "INSERT INTO users (name,email,age,city) VALUES (?,?,?,?)",
            [name, email, age, city]
        );

        return result.insertId;
    } catch (err) {
        console.error(err.message);
        throw err; // για να το πιάσει το Express error middleware
    }
}

