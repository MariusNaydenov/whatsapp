import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

export const findUser = async (req, res) => {
  const { selectedPersonId } = req.params;
  

  try {
    const user = await User.findById(selectedPersonId);

    res.status(200).json(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err.message);
  }
};
