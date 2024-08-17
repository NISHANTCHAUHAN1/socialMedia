import express from "express";
import isAuth from "../middleware/isAuth.js";
import { getMessage, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post('/send/:id', isAuth, sendMessage);
router.get('/all/:id', isAuth, getMessage);

export default router;