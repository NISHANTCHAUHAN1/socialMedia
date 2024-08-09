import { Conversation } from "../model/conversationModel.js";
import { Message } from "../model/messageModel.js";

export const sendMessage = async(req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        let conversation = await Conversation.findOne({
            participants: {$all:[senderId, receiverId]}
        });
        if(!conversation) {
            conversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage) conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);

        // socket io

        return res.status(200).json({newMessage});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}

export const getMessage = async(req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.find({
            participants: {$all: [senderId, receiverId]}
        });
        if(!conversation) return res.status(200).json({messages: []});

        return res.status(200).json({message:conversation?.messages});
    } catch (error) {
        res.status(500).json({message: "Invaild server error"});
    }
}