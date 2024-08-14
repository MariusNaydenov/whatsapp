import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    members: Array,
    messages: Array,
    participantOne: Object,
    participantTwo: Object,
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chats", chatSchema);

export default Chat;
