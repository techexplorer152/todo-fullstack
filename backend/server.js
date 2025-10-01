import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
const port = 5000;

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'DataisFire1374',
    database: 'test',
    port: 5432,
});

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",  
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));



app.get("/api/todos",async (req, res) => {

    try{
        const result = await pool.query("SELECT * FROM todos ORDER BY id ASC");
        res.json(result.rows);

    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

app.post('/api/todos', async (req, res) => {
    try{

        const {task} = req.body;
        const result = await pool.query(
            "INSERT INTO todos (task) VALUES ($1) RETURNING *",
            [task]
        )
        res.json(result.rows[0]);

    }
    catch(err){

        console.error(err.message);
        res.status(500).send("Server error");
    }
});


app.delete('/api/todos/:id', async (req, res) => {
    try{
        const {id} = req.params;
        await pool.query("DELETE FROM todos WHERE id = $1", [id]);
        res.json({ message: "Deleted successfully" });

    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");

    }
})


app.put('/api/todos/:id', async (req, res) => {
    try{
        const { id } = req.params;
        const { task } = req.body;


        const result = await pool.query(
            "UPDATE todos SET task = $1 WHERE id = $2 RETURNING *",
            [task, id]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }


        res.json(result.rows[0]);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send("Server error");
    }
})






app.listen(port, () => {
    console.log(` Server running at http://localhost:${port}`);
});
