import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from './utils/db.js';
import dotenv from 'dotenv';
import { app, server } from "./socket/socket.js"
import path from "path";

dotenv.config({});
const PORT = process.env.PORT || 8000;
// const app = express();

const __dirname = path.resolve();


//middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
}
app.use(cors(corsOptions));

import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import messageRoute from './routes/messageRoute.js';

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
})



server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});