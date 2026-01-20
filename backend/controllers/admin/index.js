const User = require("../../models/User");

const addRecruiter = async (req, res) => {
  try {
    const { userName, userEmail, password, dayofBirth, address } = req.body;

    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Recruiter email already exists" });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 12);

    const recruiter = new User({
      userName,
      userEmail,
      password: hashedPassword,
      dayofBirth,
      address,
      role: "recruiter",
    });

    await recruiter.save();
    res
      .status(201)
      .json({ success: true, message: "Recruiter added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userEmail } = req.body;

    const user = await User.findOne({ userEmail });
    console.log(user);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await User.deleteOne({ userEmail });
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const viewUser = async (req, res) => {
  try {
    const userId = req.query.id;
    console.log("userid of viewUserById", userId);

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const viewAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { addRecruiter, deleteUser, viewUser, viewAllUser };
