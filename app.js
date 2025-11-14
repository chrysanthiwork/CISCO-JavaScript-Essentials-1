import express from 'express'

import {getUsers,getUser,createUser}  from "./database.js";


const app = express()

app.use(express.json())

app.get("/users", async (req,res)=>{
    const users = await getUsers();
    res.send(users)
})

app.get("/users/:id", async (req,res)=>{
    const id = req.params.id;
    const user = await getUser(id)
    res.send(user)
})

app.post("/users", async (req, res, next) => {
    const { name, email, age, city } = req.body;
    try {
        const userId = await createUser(name, email, age, city);
        res.status(201).json({ id: userId });
    } catch (err) {
        // Αν υπάρχει duplicate email ή άλλο σφάλμα
        res.status(400).json({ error: err.message });
    }
});


app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080,()=>{
    console.log('Server started on port 8080')
})

