import { User } from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const register = async(req,res) => {

    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password)
            return res.status(400).json({message: "Something is missing, please check!"});

        const otherUser = await User.findOne({email});
        if(otherUser) return res.status(400).json({message: "Already have an account with this email"});

        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            username, email, password: hashPassword
        });

        res.status(200).json({ message: "Account created successfully."});

    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const login = async(req,res) => {
   try {
     const {email, password} = req.body;

    if(!email || !password) 
        return res.status(400).json({message: "Something is missing, please check!"});

    let otherUser = await User.findOne({email});
    if(!otherUser) return res.status(400).json({message: "Incorrect email or password"});

    const comparePassword = await bcrypt.compare(password, otherUser.password);
    if(!comparePassword) return res.status(400).json({message: "Incorrect email or password"});

    const token = await jwt.sign({userId: otherUser._id}, process.env.SEC_KEY, {
        expiresIn: "15d",
    });

    otherUser = {
        _id: otherUser._id,
        username: otherUser.username,
        email: otherUser.email,
        profilePicture: otherUser.profilePicture,
        bio: otherUser.bio,
        followers: otherUser.followers,
        following: otherUser.following,
    }

    return res.cookie("token", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
    }).json({otherUser, message: `Welcome back ${otherUser.username}`});

   } catch (error) {
        res.status(500).json({message: "Invaild server error"});
   }
}

export const logout = async(_,res) => {
    try {
        return res.cookie("token", "", {maxAge: 0}).json({message: "logged Out successfuly"});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const getProfile = async(req,res)  => {
    try {
        const userId = req.params.id;
        let otherUser = await User.findById(userId).select('-password');
        return res.status(200).json({otherUser});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const editProfile = async(req,res) => {
    try {
        const userId = req.id;
        const {bio, gender} = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if(profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const otherUser = await User.findById(userId).select('-password');
        if(!otherUser) return res.status(400).json({ message: 'User not found.'});

        if(bio) otherUser.bio = bio;
        if(gender) otherUser.gender = gender;
        if(profilePicture) otherUser.profilePicture  = cloudResponse.secure_url;

        await otherUser.save();

        return res.status(200).json({ message: 'Profile updated.', otherUser});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const getSuggestedUsers = async(req,res) => {
    try {
        const suggestedUsers = await User.find({_id: {$ne: req.id}}).select("-password");
        if(!suggestedUsers) return res.status(400).json({ message: 'Currently do not have any users'});

        return res.status(200).json({users: suggestedUsers});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const followOrUnfollow = async(req,res) => {
    try {
        const loggedInUser = req.id;  // followkarnewala
        const otherUser = req.params.id;  // jiskofollowkarunga

        if(loggedInUser === otherUser) {
            return res.status(400).json({message: "you can't follow yourself"});
        }

        const user = await User.findById(loggedInUser);
        const targetUser = await User.findById(otherUser);

        if(!user || !targetUser) 
            return res.status(400).json({message: "User not found"});

        const isFollowing = user.following.includes(otherUser);
        if(isFollowing) {
            //unfollow
            await Promise.all([
                User.updateOne({_id:loggedInUser}, {$pull : {following: otherUser}}),
                User.updateOne({_id: otherUser}, {$pull: {followers: loggedInUser}}),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        }
        else {
            // follow
            await Promise.all([
                User.updateOne({_id:loggedInUser}, {$push : {following: otherUser}}),
                User.updateOne({_id: otherUser}, {$push: {followers: loggedInUser}}),
            ])
            return res.status(200).json({ message: 'followed successfully', success: true });
        }    
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}