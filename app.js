const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { StatusNotFound } = require('./utils/errors/StatusNotFound');
const { handleError } = require('./utils/handleError');
const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');

// запуск на 3000 порту
const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
// получение куки
app.use(cookieParser());
// обновление, вместо bodyParser
app.use(express.json());
// роуты, не требующие авторизации, регистрация и логин
app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().pattern(
        /https?:\/\/(www\.)?([-a-zA-Z0-9()@:%_+.~#?&=]*)\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
      ),
      password: Joi.string().required(),
      email: Joi.string().email().required(),
    }),
  }),
  createUser,
);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.all('*', auth, (req, res, next) => {
  next(new StatusNotFound('Не существующий маршрут'));
});

app.use(errors());
app.use(handleError);

app.listen(PORT, () => {
  // console.log(`Сервер запущен на ${PORT}`);
});
