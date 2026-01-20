const express = require("express");
const router = express.Router();
const {
  authenticateMiddleware,
  isRecruiter,
} = require("../../middleware/auth-middleware");
const {
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
} = require("../../controllers/recruiter");
router.post(
  "/deleteAccount",
  authenticateMiddleware,
  isRecruiter,
  deleteAccount
);
router.get("/viewUser/:id", authenticateMiddleware, isRecruiter, viewUser);
router.get("/viewAllPosts", authenticateMiddleware, isRecruiter, viewAllPosts);
router.get(
  "/viewPostsByCategory/:categories",
  authenticateMiddleware,
  isRecruiter,
  viewPostsByCategory
);
router.post("/createPost", authenticateMiddleware, isRecruiter, createPost);
router.get("/viewAllCV", authenticateMiddleware, isRecruiter, viewAllCV);
router.get("/viewCV/:id", authenticateMiddleware, isRecruiter, viewCV);
router.delete("/deletePost", authenticateMiddleware, isRecruiter, deletePost);
router.put("/editPost", authenticateMiddleware, isRecruiter, editPost);
router.put("/editProfile", authenticateMiddleware, isRecruiter, editProfile);
router.get("/viewPost/:id", authenticateMiddleware, viewPostById);
router.get("/viewOwnPost", authenticateMiddleware, isRecruiter, viewOwnPost);
router.get(
  "/viewAllJobAppicationsByPostId/:id",
  authenticateMiddleware,
  isRecruiter,
  viewAllJobAppicationsByPostId
);
router.post(
  "/rejectApplication/:id",
  authenticateMiddleware,
  isRecruiter,
  rejectApplication
);
router.post(
  "/acceptApplication/:id",
  authenticateMiddleware,
  isRecruiter,
  acceptApplication
);
router.delete("/deleteCVRec/:id", authenticateMiddleware, deleteCVRec);
module.exports = router;
