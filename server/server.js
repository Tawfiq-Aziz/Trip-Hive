import express from "express"
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";

connectDB()

const app = express()
app.use(cors()) //Cross-origin resources

app.get('/', (req, res)=> res.send("Yeee!!! API is working!!"))

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`));
