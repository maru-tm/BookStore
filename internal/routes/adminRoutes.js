// internal/routes/adminRoutes.js

const express = require("express");
const { getUsers, updateUserRole, deleteUser } = require("../controllers/adminController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getUsers);
router.put("/users/:id/role", authMiddleware, adminMiddleware, updateUserRole);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;