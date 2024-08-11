import sharp from 'sharp';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../model/postModel.js';
import { User } from '../model/userModel.js';
import { Comment } from '../model/commentModel.js';

export const addNewPost = async(req,res) => {
    try {
        const {caption} = req.body;
        const image = req.file;
        const authorId = req.id;

        if(!image) return res.status(400).json({ message: 'Image required' });

        const optimizedImageBuffer = await sharp(image.buffer)
        .resize({width:800, height:800, fit: 'inside'})
        .toFormat('jpeg', {quality: 80}).toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudeResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption, image: cloudeResponse.secure_url, author: authorId
        });
        const user = await User.findById(authorId);
        if(user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({path: 'author', select: '-password'});
        return res.status(200).json({post, message: "Post added"});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const getAllPost = async(req,res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1})
        .populate({path: 'author', select: 'username profilePicture'})
        .populate({path: 'comments', sort: {createdAt: -1},
            populate: {path: 'author', select: 'username profilePicture'}
        });

        return res.status(200).json({posts});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const getUserPost = async(req,res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({author: authorId}).sort({createdAt: -1}).populate({
            path: 'author', select: 'username profilePicture'
        }).populate({
            path: 'comments', sort: {createdAt: -1},
            populate: {path: 'author', select: 'username profilePicture'}
        });
        return res.status(200).json({posts});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const likePost = async(req,res) => {
    try {
        const loggedInUser = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(400).json({message: 'Post not found'});

        await post.updateOne({ $addToSet: {likes: loggedInUser}});    // addtoSet ki waja se ab usersrif ek bar hi like kar payega
        await post.save();

        // socket io for notification

        return res.status(200).json({message: 'Post Liked'});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const dislikePost = async(req,res) => {
    try {
        const loggedInUser = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if(!post) return res.status(400).json({message: 'Post not found'});

        await post.updateOne({ $pull: {likes: loggedInUser}});    // addtoSet ki waja se ab usersrif ek bar hi like kar payega
        await post.save();

        // socket io for notification

        return res.status(200).json({message: 'Post disliked'});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const addComment = async(req,res) => {
    try {
       const postId = req.params.id;
       const commentedUser = req.id;
       
       const {text} = req.body;
       const post = await Post.findById(postId);
       if(!text) return res.status(400).json({message:'text is required'});

       const comment = await Comment.create({
        text, author: commentedUser, post: postId
       })

        await comment.populate({
           path:'author',
           select:"username profilePicture"
        });
   
       post.comments.push(comment._id);
       await post.save();

       return res.status(200).json({comment, message: "Comment added"});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const getCommentsOfPost = async(req,res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post: postId}).populate({path: 'author', select: 'username profilePicture'});

        if(!comments) return res.status(404).json({message:'No comments found for this post'});
        return res.status(200).json({comments});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const deletePost = async(req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if(!post) return res.status(200).json({message: "Post not found"});

        if(post.author.toString() !== authorId) return res.status(400).json({message: "Unauthorized"});

        await Post.findByIdAndDelete(postId);
        let user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        await Comment.deleteMany({post: postId});
        return res.status(200).json({ message:'Post deleted'});

    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const bookmarkPost = async(req,res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if(!post) return res.status(400).json({message:'Post not found'});

        const user = await User.findById(authorId);
        if(user.bookmarks.includes(post._id)) {
            await user.updateOne({$pull: {bookmarks: post._id}});
            await user.save();
            return res.status(200).json({type: 'unsaved', message: 'Post removed from bookmark'});
        }
        else{
            await user.updateOne({$addToSet: {bookmarks: post._id}});
            await user.save();
            return res.status(200).json({type: 'saved', message: 'Posted bookmark'});
        }
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}
