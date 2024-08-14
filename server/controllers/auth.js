import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { password, email, username } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      if (user.username === username) {
        return res.status(400).json({
          message: "Username already taken. Please choose another username.",
        });
      }
      return res.status(400).json({
        message: "Email already in use. Please use a different email.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email.Please try again with another email",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return res
        .status(400)
        .json({ message: "Password is incorrect.Try again." });
    }

    const payload = {
      userId: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    delete user.password;

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json(err.message);
  }
};
