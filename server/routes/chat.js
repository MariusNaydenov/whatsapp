import express from "express";
import { createChat, getChat, getChatsUsers } from "../controllers/chats.js";

const router = express.Router();

router.post("/create-chat", createChat);
router.get("/get-chats/:userId", getChatsUsers);
router.get("/:userId/:selectedPersonId", getChat);

export default router;
