const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Получение профиля пользователя
const getUserProfile = async (req, res) => {
  try {
    console.log(`Получение профиля пользователя: ${req.user.id}`);
    
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.warn(`Профиль не найден: ${req.user.id}`);
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    console.log(`Профиль найден: ${user.username} (${user.email})`);
    res.json(user);
  } catch (error) {
    console.error("Ошибка при получении профиля:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    console.log(`Обновление профиля пользователя: ${req.user.id}`);

    // Получаем пользователя из базы данных
    const user = await User.findById(req.user.id);
    if (!user) {
      console.warn(`Пользователь не найден: ${req.user.id}`);
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    console.log(`Найден пользователь: ${user.username} (${user.email})`);

    // Обновляем только разрешённые поля
    if (req.body.username) {
      console.log(`Обновление имени пользователя: ${user.username} -> ${req.body.username}`);
      user.username = req.body.username;
    }

    // Если переданы старый и новый пароль
    if (req.body.oldPassword && req.body.newPassword) {
      console.log(`Попытка обновления пароля для пользователя: ${user.username}`);

      // Проверяем старый пароль
      console.log(`Проверка старого пароля для пользователя: ${user.username}`);
      const isMatch = await bcrypt.compare(req.body.oldPassword, user.password);

      if (!isMatch) {
        console.warn(`Старый пароль неверный для пользователя: ${user.username}`);
        return res.status(400).json({ message: "Старый пароль неверный" });
      }
      console.log(`Старый пароль для пользователя ${user.username} совпал`);

      // Новый пароль передаём как есть, Mongoose позаботится о его хэшировании
      console.log(`Новый пароль: ${req.body.newPassword}`);
      user.password = req.body.newPassword;
      console.log(`Пароль успешно обновлён для пользователя: ${user.username}`);
    } else {
      console.log(`Обновление пароля не требуется для пользователя: ${user.username}`);
    }

    // Сохраняем изменения в базе данных (Mongoose сам хэширует пароль)
    const updatedUser = await user.save();
    console.log(`Профиль обновлён для пользователя: ${updatedUser.username}`);

    // Отправляем обновлённую информацию
    res.json({
      _id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email, // Почта остаётся неизменной
      role: updatedUser.role,
    });

  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

module.exports = { getUserProfile, updateUserProfile };
