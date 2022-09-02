const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const { STATUS_NOT_FOUND } = require("./utils/errorsCode");
const { login, createUser } = require("./controllers/users");
const auth = require("./middleware/auth");
// запуск на 3000 порту
const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
});
// получение куки
app.use(cookieParser);
// обновление, вместо bodyParser
app.use(express.json());
// роуты, не требующие авторизации,
// например, регистрация и логин
app.post("/signin", login);
app.post("/signup", createUser);

// авторизация
app.use(auth);

app.use("/users", require("./routes/users"));
app.use("/cards", require("./routes/cards"));

app.all("*", auth, (req, res, next) => {
  next(new STATUS_NOT_FOUND("Не существующий маршрут"));
});

app.listen(PORT, () => {
  // console.log(`Сервер запущен на ${PORT}`);
});
