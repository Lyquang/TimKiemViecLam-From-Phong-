require("dotenv").config();
const User = require("../../models/User");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const registerUser = async (req, res) => {
  const { userName, userEmail, password, role, dayofBirth, address } = req.body;
  const existingUser = await User.findOne({
    $or: [{ userName }, { userEmail }],
  });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bycrypt.hash(password, 12);
  try {
    const user = new User({
      userName,
      userEmail,
      role,
      password: hashedPassword,
      dayofBirth,
      address,
    });
    await user.save();
    return res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const loginUser = async (req, res) => {
  const { userEmail, password, role } = req.body;
  const existingUser = await User.findOne({ userEmail });
  console.log("existing User: ", existingUser);
  if (
    !existingUser ||
    !(await bycrypt.compare(password, existingUser.password))
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
  if (existingUser.role !== role) {
    return res.status(403).json({
      success: false,
      message: "Invalid role",
    });
  }
  const accessToken = jwt.sign(
    {
      _id: existingUser._id,
      userName: existingUser.userName,
      userEmail: existingUser.userEmail,
      role: existingUser.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "360m" },
  );
  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: existingUser._id,
        userName: existingUser.userName,
        userEmail: existingUser.userEmail,
        BoD: moment(existingUser.dayofBirth).format("DD/MM/YYYY"),
        address: existingUser.address,
        role: existingUser.role,
      },
    },
  });
};

module.exports = { registerUser, loginUser };
