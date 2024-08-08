import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import connectDB from './utils/db.js';
import dotenv from 'dotenv';

dotenv.config({});
const PORT = process.env.PORT || 8000;

const app = express();

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

app.use("/api/v1/user", userRoute);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
})