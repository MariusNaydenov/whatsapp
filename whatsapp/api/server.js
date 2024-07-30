import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../dbModels/userModel.js";
import genSalt from "bcryptjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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

mongoose
  .connect(MY_URI)
  .then(() => {
    console.log("connected to MongoDB");
    app.listen(PORT, () => {
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
