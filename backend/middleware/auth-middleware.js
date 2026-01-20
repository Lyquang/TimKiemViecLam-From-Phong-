const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log("JWT Verification Error: ", error); // In lỗi JWT
    return null; // Trả về null nếu token không hợp lệ hoặc hết hạn
  }
};

const authenticateMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authHeader", authHeader);
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated",
    });
  }

  const token = authHeader.split(' ')[1];
  // console.log("token", token);
  const payload = verifyToken(token, process.env.JWT_SECRET);
  if (!payload) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
  req.user = payload;
  next();
};

// Middleware kiểm tra admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access Denied. Admins only!" });
  }
  next();
};

// Middleware kiểm tra recruiter
const isRecruiter = (req, res, next) => {
  if (req.user.role !== "recruiter") {
    console.log("role", req.user.role);
    return res.status(403).json({ message: "Access Denied. Recruiter only!" });
  }
  next();
};

module.exports = { authenticateMiddleware, isAdmin, isRecruiter };
