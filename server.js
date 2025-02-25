// server.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./internal/config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Отдача статических файлов
app.use(express.static("public"));

// Маршруты для конкретных страниц
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"))
})

app.get("/profile", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"))
})

// Подключение маршрутов API
app.use("/api/auth", require("./internal/routes/authRoutes"));
app.use("/api/admin", require("./internal/routes/adminRoutes"));
app.use("/api/books", require("./internal/routes/bookRoutes"));
app.use("/api/orders", require("./internal/routes/orderRoutes"));
app.use("/api/users", require("./internal/routes/userRoutes")); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
