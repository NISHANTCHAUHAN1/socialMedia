import express from 'express';
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from '../controllers/userController.js';
import isAuth from '../middleware/isAuth.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/:id/profile", isAuth, getProfile);
router.post("/profile/edit", isAuth, upload.single('profilePhoto'),editProfile);
router.get("/suggested", isAuth, getSuggestedUsers);
router.post("/:id/followorunfollow", isAuth, followOrUnfollow);

export default router;