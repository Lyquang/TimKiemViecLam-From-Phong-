const express = require('express');
const router = express.Router();
const { authenticateMiddleware, isAdmin } = require("../../middleware/auth-middleware");
const { addRecruiter, deleteUser, viewUser, viewAllUser } = require("../../controllers/admin/index");
//done
router.post('/addRecruiter', authenticateMiddleware, isAdmin, addRecruiter);
router.delete('/deleteUser', authenticateMiddleware, isAdmin, deleteUser);
router.get('/viewUser', authenticateMiddleware, isAdmin, viewUser);
router.get('/viewAllUser', authenticateMiddleware, isAdmin, viewAllUser);

module.exports = router;