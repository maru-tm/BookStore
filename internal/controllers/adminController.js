const User = require("../models/userModel");

// Получение списка пользователей
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, "-password"); // Исключаем поле `password`
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// Обновление роли пользователя
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        await User.findByIdAndUpdate(req.params.id, { role });
        res.json({ message: "Роль обновлена" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

// Удаление пользователя
const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "Пользователь удалён" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

module.exports = { getUsers, updateUserRole, deleteUser };
