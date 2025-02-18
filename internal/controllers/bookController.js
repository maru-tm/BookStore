const Book = require('../models/bookModel');

// Получить все книги
const getBooks = async (req, res) => {
  console.log('Получение всех книг'); // Лог при вызове функции
  try {
    const books = await Book.find(); // Получаем все книги из базы данных
    console.log('Книги успешно получены:', books); // Лог успешного получения данных
    res.status(200).json(books);
  } catch (error) {
    console.error('Ошибка при получении книг:', error); // Лог ошибки
    res.status(500).json({ message: 'Ошибка при получении книг', error });
  }
};

// Добавить новую книгу
const addBook = async (req, res) => {
  const { title, author, releaseDate, description, genre, price, isbn, imageUrl } = req.body;

  // Проверка, что все необходимые поля переданы
  if (!title || !author || !releaseDate || !price || !isbn) {
    console.warn('Не все обязательные поля были переданы', req.body); // Лог предупреждения
    return res.status(400).json({ message: 'Не все обязательные поля были переданы' });
  }

  try {
    // Создание новой книги
    const newBook = new Book({
      title,
      author,
      releaseDate,
      description,
      genre,
      price,
      isbn,
      imageUrl
    });

    await newBook.save(); // Сохраняем книгу в базе данных
    console.log('Книга успешно добавлена:', newBook); // Лог успешного добавления
    res.status(201).json({ message: 'Книга успешно добавлена', book: newBook });
  } catch (error) {
    console.error('Ошибка при добавлении книги:', error); // Лог ошибки
    res.status(500).json({ message: 'Ошибка при добавлении книги', error });
  }
};

// Обновить данные о книге
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, releaseDate, description, genre, price, isbn, imageUrl } = req.body;

  console.log(`Попытка обновления книги с ID: ${id}`); // Лог перед обновлением

  try {
    const book = await Book.findById(id); // Ищем книгу по ID

    if (!book) {
      console.warn(`Книга с ID ${id} не найдена`); // Лог, если книга не найдена
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    // Обновление данных книги
    book.title = title || book.title;
    book.author = author || book.author;
    book.releaseDate = releaseDate || book.releaseDate;
    book.description = description || book.description;
    book.genre = genre || book.genre;
    book.price = price || book.price;
    book.isbn = isbn || book.isbn;
    book.imageUrl = imageUrl || book.imageUrl;

    await book.save(); // Сохраняем обновленные данные книги
    console.log('Данные о книге успешно обновлены:', book); // Лог успешного обновления
    res.status(200).json({ message: 'Данные о книге успешно обновлены', book });
  } catch (error) {
    console.error('Ошибка при обновлении книги:', error); // Лог ошибки
    res.status(500).json({ message: 'Ошибка при обновлении книги', error });
  }
};

// Удалить книгу
const deleteBook = async (req, res) => {
  const { id } = req.params;

  console.log(`Попытка удалить книгу с ID: ${id}`); // Лог перед удалением

  try {
    const book = await Book.findById(id); // Ищем книгу по ID

    if (!book) {
      console.warn(`Книга с ID ${id} не найдена`); // Лог, если книга не найдена
      return res.status(404).json({ message: 'Книга не найдена' });
    }

    await book.remove(); // Удаляем книгу из базы данных
    console.log(`Книга с ID ${id} успешно удалена`); // Лог успешного удаления
    res.status(200).json({ message: 'Книга успешно удалена' });
  } catch (error) {
    console.error('Ошибка при удалении книги:', error); // Лог ошибки
    res.status(500).json({ message: 'Ошибка при удалении книги', error });
  }
};

module.exports = {
  getBooks,
  addBook,
  updateBook,
  deleteBook
};
