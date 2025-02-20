// internal/routes/orderRoutes.js
const express = require("express");
const { createOrder, getUserOrders, getOrder, updateOrder, deleteOrder } = require("../controllers/orderController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

// Создать новый заказ
router.post("/", authMiddleware, createOrder);

// Получить все заказы пользователя (только для авторизованного пользователя)
router.get("/", authMiddleware, getUserOrders);

// Получить заказ по ID (доступно только администратору или владельцу заказа)
router.get("/:id", authMiddleware, getOrder);

// Обновить заказ (доступно только администратору)
router.put("/:id", authMiddleware, adminMiddleware, updateOrder);

// Удалить заказ (доступно только администратору)
router.delete("/:id", authMiddleware, adminMiddleware, deleteOrder);

module.exports = router;
