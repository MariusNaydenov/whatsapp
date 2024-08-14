import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();
const MY_URI = process.env.MY_URI;
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());
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

  socket.on("disconnect", () => {
    // console.log("User disconnected");
  });
});

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/chats", chatRoutes);

mongoose
  .connect(MY_URI)
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => {
      console.log(`server is listen on port http://localhost:${PORT} `);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("API is running successfully");
});
