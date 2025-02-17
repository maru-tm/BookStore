const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Токен истекает через 1 час
  );
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверяем, существует ли уже пользователь с таким email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email уже зарегистрирован" });
    }

    // Создаем нового пользователя с ролью "user" по умолчанию
    const user = await User.create({
      username,
      email,
      password,
      role: "user", // Роль всегда будет "user"
    });

    res.status(201).json({ message: "Пользователь зарегистрирован" });
  } catch (error) {
    console.error(error); // Для отладки
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверяем, существует ли пользователь с таким email
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Неверные учетные данные" });
    }

    // Генерация JWT токена
    const token = generateToken(user);

    res.json({ token, userId: user._id, role: user.role }); // Возвращаем роль вместе с токеном
  } catch (error) {
    console.error(error); // Для отладки
    res.status(500).json({ message: "Ошибка сервера" });
  }
};
