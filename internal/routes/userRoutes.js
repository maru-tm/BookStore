const express = require("express");
const { getUserProfile, updateUserProfile } = require("../controllers/userController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Получить профиль пользователя (только для авторизованных пользователей)
router.get("/profile", authMiddleware, getUserProfile);

// Обновить профиль пользователя (только для авторизованных пользователей)
router.put("/profile", authMiddleware, updateUserProfile);

module.exports = router;
