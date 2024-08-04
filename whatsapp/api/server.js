import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../dbModels/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import chatModel from "../dbModels/chatModel.js";
import messageModel from "../dbModels/messageModel.js";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const MY_URI = process.env.MY_URI;
const PORT = process.env.PORT;
const SECRET_KEY = process.env.JWT_SECRET;

const app = express();

const hashedPassword = async (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPwd = await bcrypt.hash(password, salt);
  return hashedPwd;
};

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  // console.log("A user connected");

  socket.on("message", (msg) => {
    // console.log("Message received: " + msg);
    io.emit("message", msg);
  });

  socket.on("someData", (data) => {
    io.emit("someData", data);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});

mongoose
  .connect(MY_URI)
  .then(() => {
    console.log("connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`app is listen on port http://localhost:${PORT} `);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("Welcome to whatsapp APIs");
});

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const userN = await User.findOne({ username });

    if (user) {
      return res.status(409).json("Email already exists");
    }

    if (userN) {
      return res.status(409).json("Username already exists");
    }

    const hashedPass = await hashedPassword(password);
    await User.create({ username, email, password: hashedPass });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json("The email does not exist");
    }

    const isPwdsMatched = await bcrypt.compare(password, user.password);

    if (!isPwdsMatched) {
      return res.status(401).json("The password is incorrect");
    }

    const payload = {
      userId: user._id,
      username: user.username,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});

app.post("/api/user", async (req, res) => {
  const { id } = req.body;

  try {
    const user = await User.findById(id);
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }
});

app.post("/api/create-chat", async (req, res) => {
  const { firstId, secondId, content } = req.body;

  try {
    const sender = await User.findById(firstId);
    const receiver = await User.findById(secondId);
    const createdMessage = new messageModel({
      sender: sender,
      content: content,
    });
    await createdMessage.save();
    let chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) {
      await chat.updateOne({ $push: { messages: createdMessage } });
      chat = await chatModel.findById(chat._id).populate("messages");
    } else {
      chat = await chatModel.create({
        members: [firstId, secondId],
        participantOne: sender,
        participantTwo: receiver,
        messages: [createdMessage],
      });
    }
    res.status(201).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json("server error");
  }
});

app.get("/api/get-chats/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });
    if (chats) {
      res.status(201).json(chats);
    } else {
      res.status(201).json([]);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("server error");
  }
});

app.get("/api/chat/:firstUserId/:secondUserId", async (req, res) => {
  const { firstUserId, secondUserId } = req.params;

  try {
    const chat = await chatModel.find({
      members: { $all: [firstUserId, secondUserId] },
    });

    if (chat) {
      res.status(200).json(chat);
    } else {
      res.status(200).json([]);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
});
