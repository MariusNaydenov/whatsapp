import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

export const createChat = async (req, res) => {
  const { userId, receiverId, message } = req.body;

  try {
    const sender = await User.findById(userId);
    const receiver = await User.findById(receiverId);

    const newMessage = new Message({
      sender: sender.username,
      content: message,
    });

    newMessage.save();

    let chat = await Chat.findOne({
      members: { $all: [userId, receiverId] },
    });

    if (chat) {
      chat.messages.push(newMessage);
      await chat.save();
    } else {
      chat = await Chat.create({
        members: [userId, receiverId],
        participantOne: sender,
        participantTwo: receiver,
        messages: [newMessage],
      });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
};

export const getChatsUsers = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await Chat.find({
      members: { $in: [userId] },
    });

    // if (chats) {
    //   res.status(200).json(chats);
    // } else {
    //   res.status(200).json([]);
    // }

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

export const getChat = async (req, res) => {
  const { userId, selectedPersonId } = req.params;

  try {
    const chat = await Chat.find({
      members: { $all: [userId, selectedPersonId] },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};
