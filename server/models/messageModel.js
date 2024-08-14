import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: String,
    content: String,
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Messages", messageSchema);

export default Message;
