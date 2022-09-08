const bcrypt = require('bcrypt'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const { StatusNotFound } = require('../utils/errors/StatusNotFound');
const { ConflictError } = require('../utils/errors/ConflictError');
const { StatusBadRequest } = require('../utils/errors/StatusBadRequest');
const userModel = require('../models/user');
const { STATUS_OK, STATUS_CREATED } = require('../utils/errors/errorsCode');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  // userModel.init();

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
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь уже существует'));
      } else if (err.name === 'ValidationError') {
        next(
          new StatusBadRequest(
            'Переданы некорректные данные при создании пользователя пользователя',
          ),
        );
      } else {
        next(err);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
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
    .orFail(() => {
      throw new StatusNotFound('Пользователь не существует');
    })
    .then((user) => res.send(user))
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
    .orFail(() => {
      throw new StatusNotFound(`Пользователь с id=${req.user._id} не найден`);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new StatusBadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.patchUserMeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new StatusNotFound(`Пользователь с id=${req.user._id} не найден`);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new StatusBadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'SECRET', {
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
