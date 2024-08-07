import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from './utils/db.js';
import dotenv from 'dotenv';

dotenv.config({});

const app = express();

app.get('/', (req,res) => {
    res.send("hello nish from backend");
})

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOptions));



const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
})