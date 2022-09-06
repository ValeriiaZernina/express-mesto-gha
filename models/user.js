const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt'); // импортируем bcrypt
const { UnauthorizedStatus } = require('../utils/errors');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    match: /^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=]*$/i,
  },
  email: {
    type: String,
    required: [true, 'Поле "email" должно быть заполнено'],
    unique: true,
    validate: [validator.isEmail, 'Некорректный email'],
  },
  password: {
    type: String,
    required: [true, 'Поле "password" должно быть заполнено'],
    minlength: [5, 'Пароль должен быть  не менее 6 символов'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function test(email, password) {
  return this.findOne({ email })
    .select('+password')
    .orFail(() => {
      throw new UnauthorizedStatus();
    })
    .then((user) => bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new UnauthorizedStatus();
      }
      return user;
    }));
};

module.exports = mongoose.model('user', userSchema);
