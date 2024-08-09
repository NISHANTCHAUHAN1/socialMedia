import express from 'express';
import isAuth from '../middleware/isAuth.js';
import {addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from '../controllers/postController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post("/addpost", isAuth, upload.single('image'), addNewPost);
router.get("/getallpost",isAuth, getAllPost);
router.get("/userpost/all", isAuth, getUserPost);
router.get("/like/:id", isAuth, likePost);
router.get("/dislike/:id", isAuth, dislikePost);
router.post("/comment/:id",isAuth, addComment);
router.get("/comment/all/:id",isAuth, getCommentsOfPost);
router.delete("/delete/:id", isAuth, deletePost);
router.get("/bookmark/:id",isAuth, bookmarkPost);


export default router;