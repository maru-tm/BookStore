// internal/models/bookModel.js
const mongoose = require('mongoose');

// Define the schema for a book
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Book title
  author: { type: String, required: true }, // Book author
  releaseDate: { type: Date, required: true }, // Book release date
  description: { type: String }, // Book description
  genre: { type: String }, // Book genre
  price: { type: Number, required: true }, // Book price
  isbn: { type: String, unique: true }, // Book ISBN
});

// Export the book model
module.exports = mongoose.model('Book', bookSchema);
