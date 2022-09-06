const bcrypt = require('bcrypt'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { STATUS_OK, STATUS_CREATED } = require('../utils/errorsCode');

const {
  StatusBadRequest,
  StatusNotFound,
  UnauthorizedStatus,
} = require('../utils/errors');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // userModel.init();
  if (!email || !password) {
    throw new StatusBadRequest('Обязательные поля');
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => userModel.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => res.status(STATUS_CREATED).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUsersMe = (req, res, next) => {
  const { _id: id } = req.user;

  userModel
    .findById(id)
    .then((user) => res.status(STATUS_OK).send(user))
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  userModel
    .findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res
          .status(UnauthorizedStatus)
          .send({ message: 'Запрашиваемый пользователь не найден.' });
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.patchUserMe = (req, res, next) => {
  const { name, about } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        return res
          .status(StatusNotFound)
          .send({ message: 'Запрашиваемый пользователь не найден.' });
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.patchUserMeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        return res
          .status(StatusBadRequest)
          .send({ message: 'Запрашиваемый пользователь не найден.' });
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      });
      res
        .cookie(
          'jwt',
          token, // token - наш JWT токен, который мы отправляем
          { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true },
        )
        .send({ token });
    })
    .catch(next);
};
