import express from 'express';
import isAuth from '../middleware/isAuth.js';
import {addComment, addNewPost, bookmarkPost, deletePost, dislikePost, getAllPost, getCommentsOfPost, getUserPost, likePost } from '../controllers/postController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

router.post("/addpost", isAuth, upload.single('image'), addNewPost);
router.get("/getallpost",isAuth, getAllPost);
router.get("/userpost/all", isAuth, getUserPost);
router.get("/:id/like", isAuth, likePost);
router.get("/:id/dislike", isAuth, dislikePost);
router.post("/:id/comment",isAuth, addComment);
router.get("/:id/comment/all",isAuth, getCommentsOfPost);
router.delete("/delete/:id", isAuth, deletePost);
router.get("/:id/bookmark",isAuth, bookmarkPost);


export default router;