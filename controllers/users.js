const bcrypt = require("bcrypt"); // импортируем bcrypt
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const {
  STATUS_OK,
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
  UNAUTHORIZED_STATUS,
} = require("../utils/errorsCode");

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      userModel.create({
        name,
        about,
        avatar,
        email,
        password: hash, // записываем хеш в базу
      })
    )
    .then((user) => {
      res.status(STATUS_CREATED).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
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
    .then((user) => res.status(STATUS_OK).send({ data: user[0] }))
    .catch(next);
};
// {
//   if (err.name === "CastError") {
//     res
//       .status(STATUS_NOT_FOUND)
//       .send({ message: "ID пользователя не найдено!" });
//   } else {
//     res
//       .status(STATUS_INTERNAL_SERVER_ERROR)
//       .send({ message: `${err.name} ${err.message}` });
//   }
// });

module.exports.getUsersById = (req, res) => {
  userModel
    .findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res
          .status(STATUS_NOT_FOUND)
          .send({ message: "Запрашиваемый пользователь не найден." });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные при поиске пользователя.",
        });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: `${err.name} ${err.message}` });
      }
    });
};

module.exports.patchUserMe = (req, res) => {
  const { name, about } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true }
    )
    .then((user) => {
      if (!user) {
        return res
          .status(STATUS_NOT_FOUND)
          .send({ message: "Запрашиваемый пользователь не найден." });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Некорректные данные при обновлении профиля." });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Что-то пошло не так!" });
      }
    });
};

module.exports.patchUserMeAvatar = (req, res) => {
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true }
    )
    .then((user) => {
      if (!user) {
        return res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Запрашиваемый пользователь не найден." });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Некорректные данные при обновлении аватара." });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Что-то пошло не так!" });
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sing({ _id: user._id }, "some-secret-key", {
        expiresIn: 1000 * 60 * 60 * 24 * 7,
      });
      res
        .cookie(
          "jwt",
          token, // token - наш JWT токен, который мы отправляем
          { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true }
        )
        .send({ token });
    })
    .catch(next);
};
