const express = require('express');
const mongoose = require('mongoose');
const { STATUS_NOT_FOUND } = require('./utils/errorsCode');
// запуск на 3000 порту
const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// обновление, вместо bodyParser
app.use(express.json());

// временное решение авторизации
app.use((req, res, next) => {
  req.user = { _id: '63061d515567f1fe12bd6002' };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: 'Не существующий маршрут' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT}`);
});
