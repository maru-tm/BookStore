const mongoose = require("mongoose");
const Book = require("../models/bookModel");

// Получить все книги
const getBooks = async (req, res) => {
  try {
    console.log("Запрос на получение всех книг");
    const books = await Book.find().lean();
    console.log(`Найдено ${books.length} книг`);
    res.status(200).json(books);
  } catch (error) {
    console.error("Ошибка при получении книг:", error);
    res.status(500).json({ message: "Ошибка при получении книг", error });
  }
};

// Получить книгу по ID
const getBook = async (req, res) => {
  const { id } = req.params;

  console.log(`Запрос на получение книги с ID: ${id}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Ошибка: Некорректный ID книги");
    return res.status(400).json({ message: "Некорректный ID книги" });
  }

  try {
    const book = await Book.findById(id).lean();

    if (!book) {
      console.log("Ошибка: Книга не найдена");
      return res.status(404).json({ message: "Книга не найдена" });
    }

    console.log("Книга успешно найдена:", book);
    res.status(200).json(book);
  } catch (error) {
    console.error("Ошибка при получении книги:", error);
    res.status(500).json({ message: "Ошибка при получении книги", error });
  }
};

// Добавить новую книгу
const addBook = async (req, res) => {
  const { title, author, releaseDate, description, genre, price, isbn, imageUrl } = req.body;

  console.log("Запрос на добавление книги с данными:", req.body);

  if (!title || !author || !releaseDate || !price || !isbn) {
    console.log("Ошибка: Не все обязательные поля были переданы");
    return res.status(400).json({ message: "Не все обязательные поля были переданы" });
  }

  if (isNaN(price) || price <= 0) {
    console.log("Ошибка: Цена должна быть положительным числом");
    return res.status(400).json({ message: "Цена должна быть положительным числом" });
  }

  try {
    const newBook = new Book({
      title,
      author,
      releaseDate,
      description,
      genre,
      price,
      isbn,
      imageUrl,
    });

    await newBook.save();
    console.log("Книга успешно добавлена:", newBook);
    res.status(201).json({ message: "Книга успешно добавлена", book: newBook });
  } catch (error) {
    console.error("Ошибка при добавлении книги:", error);
    res.status(500).json({ message: "Ошибка при добавлении книги", error });
  }
};

// Обновить данные о книге
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, releaseDate, description, genre, price, isbn, imageUrl } = req.body;

  console.log(`Запрос на обновление книги с ID: ${id}, новыми данными:`, req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Ошибка: Некорректный ID книги");
    return res.status(400).json({ message: "Некорректный ID книги" });
  }

  try {
    const book = await Book.findById(id);

    if (!book) {
      console.log("Ошибка: Книга не найдена");
      return res.status(404).json({ message: "Книга не найдена" });
    }

    // Обновляем данные книги
    book.title = title ?? book.title;
    book.author = author ?? book.author;
    book.releaseDate = releaseDate ?? book.releaseDate;
    book.description = description ?? book.description;
    book.genre = genre ?? book.genre;
    book.price = price ?? book.price;
    book.isbn = isbn ?? book.isbn;
    book.imageUrl = imageUrl ?? book.imageUrl;

    await book.save();
    console.log("Данные книги успешно обновлены:", book);
    res.status(200).json({ message: "Данные о книге успешно обновлены", book });
  } catch (error) {
    console.error("Ошибка при обновлении книги:", error);
    res.status(500).json({ message: "Ошибка при обновлении книги", error });
  }
};

// Удалить книгу
const deleteBook = async (req, res) => {
  const { id } = req.params;

  console.log(`Запрос на удаление книги с ID: ${id}`);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Ошибка: Некорректный ID книги");
    return res.status(400).json({ message: "Некорректный ID книги" });
  }

  try {
    const book = await Book.findById(id);

    if (!book) {
      console.log("Ошибка: Книга не найдена");
      return res.status(404).json({ message: "Книга не найдена" });
    }

    await Book.deleteOne({ _id: id });
    console.log(`Книга с ID ${id} успешно удалена`);
    res.status(200).json({ message: "Книга успешно удалена" });
  } catch (error) {
    console.error("Ошибка при удалении книги:", error);
    res.status(500).json({ message: "Ошибка при удалении книги", error });
  }
};

module.exports = {
  getBooks,
  getBook,   
  addBook,   
  updateBook,
  deleteBook,
};
