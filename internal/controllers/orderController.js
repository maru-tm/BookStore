const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken'); // Подключаем jwt для декодирования

// Получение всех заказов
const getOrders = async (req, res) => {
  try {
    console.log("Запрос на получение всех заказов");

    const orders = await Order.find().populate("orderItems.bookId", "title price").lean();
    
    console.log(`Найдено заказов: ${orders.length}`);
    res.status(200).json(orders);
  } catch (error) {
    console.error("Ошибка при получении заказов:", error);
    res.status(500).json({ message: "Ошибка при получении заказов", error });
  }
};

// Получить все заказы пользователя
const getUserOrders = async (req, res) => {
  const userId = req.user._id; // ID пользователя из JWT токена
  try {
    console.log(`Запрос на получение заказов пользователя с ID: ${userId}`);

    const orders = await Order.find({ userId }).populate("orderItems.bookId", "title price").lean();
    
    console.log(`Найдено заказов для пользователя: ${orders.length}`);
    res.status(200).json(orders);
  } catch (error) {
    console.error(`Ошибка при получении заказов пользователя с ID: ${userId}`, error);
    res.status(500).json({ message: "Ошибка при получении заказов пользователя", error });
  }
};

// Получить заказ по ID
const getOrder = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id; // ID пользователя из JWT токена

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Некорректный ID заказа: ${id}`);
    return res.status(400).json({ message: "Некорректный ID заказа" });
  }

  try {
    console.log(`Запрос на получение заказа с ID: ${id}`);

    const order = await Order.findById(id).populate("orderItems.bookId", "title price").lean();
    if (!order) {
      console.error(`Заказ с ID: ${id} не найден`);
      return res.status(404).json({ message: "Заказ не найден" });
    }

    // Проверка прав доступа (если заказ принадлежит пользователю или администратору)
    if (order.userId.toString() !== userId && req.user.role !== "admin") {
      console.error(`Пользователь с ID: ${userId} не имеет прав для просмотра этого заказа`);
      return res.status(403).json({ message: "У вас нет прав для просмотра этого заказа" });
    }

    console.log(`Заказ с ID: ${id} успешно найден`);
    res.status(200).json(order);
  } catch (error) {
    console.error(`Ошибка при получении заказа с ID: ${id}`, error);
    res.status(500).json({ message: "Ошибка при получении заказа", error });
  }
};

// Создание нового заказа
const createOrder = async (req, res) => {
    try {
        const { orderItems, totalCost, token } = req.body;

        if (!token) {
            return res.status(401).json({ message: "Токен отсутствует" });
        }

        // Декодируем токен
        let userId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id; // Извлекаем userId
        } catch (error) {
            return res.status(401).json({ message: "Неверный или просроченный токен" });
        }

        if (!Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).json({ message: "Необходимо указать хотя бы одну книгу в заказе" });
        }

        if (isNaN(totalCost) || totalCost <= 0) {
            return res.status(400).json({ message: "Общая стоимость должна быть положительным числом" });
        }

        // Проверяем, существует ли пользователь
        const user = await User.findById(userId).select("username").lean();
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        const formattedOrderItems = orderItems.map(item => ({
            bookId: item.bookId,
            bookTitle: item.bookTitle,
            bookPrice: item.bookPrice,
            quantity: item.quantity,
        }));

        const newOrder = new Order({
            userId,
            username: user.username,
            orderItems: formattedOrderItems,
            totalCost,
        });

        await newOrder.save();
        return res.status(201).json({ message: "Заказ успешно создан", order: newOrder });
    } catch (error) {
        console.error("Ошибка при создании заказа:", error);
        return res.status(500).json({ message: "Ошибка при создании заказа", error });
    }
};

  
// Обновить заказ
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Некорректный ID заказа для обновления: ${id}`);
    return res.status(400).json({ message: "Некорректный ID заказа" });
  }

  try {
    console.log(`Запрос на обновление заказа с ID: ${id}`);

    const order = await Order.findById(id);
    if (!order) {
      console.error(`Заказ с ID: ${id} не найден для обновления`);
      return res.status(404).json({ message: "Заказ не найден" });
    }

    order.status = status ?? order.status;
    await order.save();

    console.log(`Статус заказа с ID: ${id} обновлен`);
    res.status(200).json({ message: "Статус заказа обновлен", order });
  } catch (error) {
    console.error(`Ошибка при обновлении заказа с ID: ${id}`, error);
    res.status(500).json({ message: "Ошибка при обновлении заказа", error });
  }
};

// Удалить заказ
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.error(`Некорректный ID заказа для удаления: ${id}`);
    return res.status(400).json({ message: "Некорректный ID заказа" });
  }

  try {
    console.log(`Запрос на удаление заказа с ID: ${id}`);

    const order = await Order.findById(id);
    if (!order) {
      console.error(`Заказ с ID: ${id} не найден для удаления`);
      return res.status(404).json({ message: "Заказ не найден" });
    }

    await Order.deleteOne({ _id: id });

    console.log(`Заказ с ID: ${id} успешно удален`);
    res.status(200).json({ message: "Заказ успешно удален" });
  } catch (error) {
    console.error(`Ошибка при удалении заказа с ID: ${id}`, error);
    res.status(500).json({ message: "Ошибка при удалении заказа", error });
  }
};

module.exports = {
  getOrders,
  getUserOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
};
