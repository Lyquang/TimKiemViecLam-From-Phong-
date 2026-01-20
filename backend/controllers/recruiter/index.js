const User = require("../../models/User");
const Post = require("../../models/Post");
const JobApplication = require("../../models/JobApplication");

const deleteAccount = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    await User.findByIdAndDelete(recruiterId);
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

const viewAllPostBelongToMe = async (req, res) => {
  try {
    const posts = await Post.find({});
  } catch (error) {}

  // try {
  //   const { postId } = req.body;
  //   const post = await Post.findById(postId);

  //   if (!post) {
  //     return res
  //       .status(404)
  //       .json({ success: false, message: "Post not found" });
  //   }

  //   // Kiểm tra quyền sở hữu bài đăng
  //   if (post.user_id.toString() !== req.user._id.toString()) {
  //     console.log("postUserId", post.user_id);
  //     console.log("");
  //     return res
  //       .status(403)
  //       .json({ success: false, message: "Unauthorized to delete this post" });
  //   }

  //   await Post.findByIdAndDelete(postId);
  //   res
  //     .status(200)
  //     .json({ success: true, message: "Post deleted successfully" });
  // } catch (error) {
  //   res.status(500).json({ success: false, message: error.message });
  // }
};

const viewPostsByCategory = async (req, res) => {
  try {
    const categories = req.params.categories.split(",");
    const posts = await Post.find({ category: { $in: categories } });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, salary, address, category } = req.body;
    const newPost = new Post({
      title,
      content,
      salary,
      address,
      user_id: req.user._id,
      category,
      companyName: req.user.userName,
    });
    await newPost.save();
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const viewAllCV = async (req, res) => {
  try {
    //mảng chứa các object chứa post_id của các bài Post của nhà tuyển dụng đó
    const recruiterJobs = await Post.find({ user_id: req.user._id }).select(
      "_id",
    );
    //mảng chỉ chứa các giá trị _id
    const jobIds = recruiterJobs.map((job) => job._id);
    const applications = await JobApplication.find({
      job_id: { $in: jobIds },
    }).populate("applicant_id", "userName userEmail");
    console.log(
      `các đơn ứng tuyển của nhà tuyển dụng ${req.user._id} là: ${applications}`,
    );
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const viewCV = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id).populate(
      "applicant_id",
      "userName userEmail",
    );
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    res.status(200).json({
      success: true,
      cv: application.cv,
      applicant: application.applicant_id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Kiểm tra quyền sở hữu bài đăng
    if (post.user_id.toString() !== req.user._id.toString()) {
      console.log("postUserId", post.user_id);
      console.log("");
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(postId);
    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId, title, content, salary, address, category } = req.body;
    const post = await Post.findById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Kiểm tra quyền sở hữu bài đăng
    if (post.user_id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized to edit this post" });
    }

    // Cập nhật thông tin bài đăng
    post.title = title || post.title;
    post.content = content || post.content;
    post.salary = salary || post.salary;
    post.address = address || post.address;
    post.category = category || post.category;

    await post.save();
    res
      .status(200)
      .json({ success: true, message: "Post updated successfully", post });
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

const viewOwnPost = async (req, res) => {
  try {
    const recruiterId = req.user._id;
    // const recruiteruserEmail = req.user.userEmail;
    // console.log("recruiteruserEmail",  recruiteruserEmail);
    const posts = await Post.find({ user_id: recruiterId });
    // console.log("ownPost", posts);
    if (!posts)
      return res
        .status(404)
        .json({ success: false, message: "No posts found for this user" });
    res.status(200).json({ success: true, posts: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const viewAllJobAppicationsByPostId = async (req, res) => {
  try {
    const postId = req.params.id;
    const applications = await JobApplication.find({ job_id: postId });
    if (!applications || applications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No applications found for this post",
      });
    }
    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const rejectApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await JobApplication.findByIdAndUpdate(
      applicationId,
      { status: "rejected" },
      { new: true },
    );
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const acceptApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const application = await JobApplication.findByIdAndUpdate(
      applicationId,
      { status: "accepted" },
      { new: true },
    );
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const deleteCVRec = async (req, res) => {
  try {
    const cv_id = req.params.id;
    const foundCV = await JobApplication.deleteOne({ _id: cv_id });
    console.log("foundVC: ", foundCV);
    res.status(200).json({ message: "Delete CV successfully!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Delete CV fail!!!", success: false });
  }
};
module.exports = {
  viewPostById,
  deleteAccount,
  viewUser,
  viewAllPosts,
  viewPostsByCategory,
  createPost,
  viewAllCV,
  viewCV,
  deletePost,
  editPost,
  editProfile,
  viewOwnPost,
  viewAllJobAppicationsByPostId,
  rejectApplication,
  acceptApplication,
  deleteCVRec,
};
