import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: Object,
    content: String,
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model("Messages", messageSchema);

export default messageModel;
