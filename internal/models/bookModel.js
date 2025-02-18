// internal/models/bookModel.js
const mongoose = require('mongoose');

// Определение схемы для книги
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Название книги
  author: { type: String, required: true }, // Автор книги
  releaseDate: { type: Date, required: true }, // Дата выхода книги
  description: { type: String }, // Описание книги
  genre: { type: String }, // Жанр книги
  price: { type: Number, required: true }, // Цена книги
  isbn: { type: String, unique: true }, // ISBN книги
});

// Экспортируем модель книги
module.exports = mongoose.model('Book', bookSchema);
