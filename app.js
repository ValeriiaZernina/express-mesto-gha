const express = require("express");
const mongoose = require("mongoose");
// запуск на 3000 порту
const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});

app.get("", (req, res) => {
  res.send("Hello");
});

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT}`);
});
