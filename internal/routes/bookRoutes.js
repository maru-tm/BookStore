// internal/routes/bookRoutes.js

const express = require("express");
const { getBooks, getBook, addBook, updateBook, deleteBook } = require("../controllers/bookController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Получить все книги
router.get("/", authMiddleware, getBooks); 

// Получить книгу по ID
router.get("/:id", authMiddleware, getBook);  

// Добавить новую книгу
router.post("/", authMiddleware, adminMiddleware, addBook); 

// Обновить книгу
router.put("/:id", authMiddleware, adminMiddleware, updateBook);

// Удалить книгу
router.delete("/:id", authMiddleware, adminMiddleware, deleteBook);

module.exports = router;
