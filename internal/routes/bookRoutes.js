const express = require("express");
const { getBooks, addBook, updateBook, deleteBook } = require("../controllers/bookController");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Получить все книги
router.get("/", authMiddleware, adminMiddleware, getBooks); // Заменить '/books' на просто '/'

// Добавить новую книгу
router.post("/", authMiddleware, adminMiddleware, addBook); // Заменить '/books' на просто '/'

// Обновить книгу
router.put("/:id", authMiddleware, adminMiddleware, updateBook);

// Удалить книгу
router.delete("/:id", authMiddleware, adminMiddleware, deleteBook);

module.exports = router;
