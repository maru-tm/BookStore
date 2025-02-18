const jwt = require("jsonwebtoken");

// Middleware для проверки токена
const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Нет доступа. Токен не предоставлен или не в правильном формате." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Неверный токен или истек срок действия" });
    }
};


// Middleware для проверки роли администратора
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Доступ запрещен" });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
