const User = require("../../models/User");
const Post = require("../../models/Post");
const JobApplication = require("../../models/JobApplication");
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    res
      .status(200)
      .json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const viewUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const viewAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const viewPostsByCategory = async (req, res) => {
  try {
    const categories = req.params.categories.split(",");

    const posts = await Post.find({ category: { $in: categories } }); // Tìm bài đăng chứa ít nhất 1 category

    //if (posts.length === 0) return res.status(404).json({success: false, message: "No posts found in these categories" });

    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const viewPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    res.status(200).json({ success: true, post: post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const applyForJob = async (req, res) => {
  try {
    const { job_id, job_name } = req.body;
    console.log("job_id: ", job_id);
    const applicant_id = req.user._id;
    const cvPath = req.file ? req.file.path : null;
    console.log("cvPath: ", cvPath);
    if (!job_id || !cvPath) {
      return res
        .status(400)
        .json({ success: false, message: "Job ID and CV file are required" });
    }

    const application = new JobApplication({
      job_id,
      job_name,
      applicant_id,
      cv: cvPath,
    });

    await application.save();
    res
      .status(201)
      .json({ success: true, message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editProfile = async (req, res) => {
  try {
    const { userName, userEmail, address, dayofBirth } = req.body;

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.userName = userName || user.userName;
    user.userEmail = userEmail || user.userEmail;
    user.address = address || user.address;
    user.dayofBirth = dayofBirth || user.dayofBirth;

    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const viewAllJobAppications = async (req, res) => {
  try {
    const userId = req.user._id;
    const applications = await JobApplication.find({
      applicant_id: userId,
    }).populate("applicant_id");

    if (!applications || applications.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No job applications found" });
    }

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getAllCV = async (req, res) => {
  try {
    const { _id } = req.user;
    const foundUser = await User.findById({ _id });
    res
      .status(200)
      .json({ message: "Get all CV successfully!", data: foundUser.CVs });
  } catch (error) {
    res.status(500).json({ message: "Get All CV fail!!!", success: false });
  }
};
const addCV = async (req, res) => {
  try {
    const cvPath = req.file ? req.file.path : null;
    const cvName = req.file ? req.file.originalname : null;
    const { _id } = req.user;
    let foundUser = await User.findById({ _id });
    foundUser.CVs.push({
      cvLink: cvPath,
      cvName: cvName.split(".")[0],
    });
    await foundUser.save();
    console.log("found User: ", foundUser);
    res.status(200).json({ message: "Add CV successfully!", data: foundUser });
  } catch (error) {
    console.log("error in addCV: ", error);
    res.status(500).json({ message: "error" });
  }
};
const removeSpecificCV = async (req, res) => {
  try {
    const { _id } = req.user;
    const { cvId } = req.body;
    console.log("cvId: ", cvId);
    let foundUser = await User.findById({ _id });
    foundUser.CVs = foundUser.CVs.filter((cv) => cv._id.toString() !== cvId);
    console.log("foundUser: ", foundUser);
    await foundUser.save();
    res.status(200).json({
      message: "Remove CV successfully!",
      success: true,
      data: foundUser,
    });
  } catch (error) {
    console.log("Error in removeSpecificCV: ", error);
    res.status(500).json({ message: "Remove CV fail!!!", success: false });
  }
};
module.exports = {
  deleteAccount,
  viewUser,
  viewAllPosts,
  viewPostsByCategory,
  applyForJob,
  editProfile,
  viewPostById,
  viewAllJobAppications,
  addCV,
  removeSpecificCV,
  getAllCV,
};
