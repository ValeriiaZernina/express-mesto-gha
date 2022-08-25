const userModel = require("../models/user");
const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require("../utils/errorsCode");

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userModel
    .create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Некорректные данные при создании пользователя." });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Что-то пошло не так!" });
      }
    });
};

module.exports.getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => res.send(users))
    .catch((err) => {
      res
        .status(STATUS_INTERNAL_SERVER_ERRO)
        .send({ message: "Что-то пошло не так!" });
    });
};

module.exports.getUsersMe = (req, res) => {
  userModel
    .findById(req.user._id)
    .then((user) => res.send(user))
    .catch((err) =>
      res.status(500).send({ message: `${err.name}: ${err.message}` })
    );
};

module.exports.getUsersById = (req, res) => {
  userModel
    .findById(req.params.id)
    .then((user) => res.send(user))
    .catch((err) =>
      res.status(500).send({ message: `${err.name}: ${err.message}` })
    );
};

module.exports.patchUserMe = (req, res) => {
  const { name, about } = req.body;
  userModel
    .findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => res.send(user))
    .catch((err) =>
      res.status(500).send({ message: `${err.name}: ${err.message}` })
    );
};

module.exports.patchUserMeAvatar = (req, res) => {
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
        .status(STATUS_BAD_REQUEST)
        .send({ message: "Запрашиваемый пользователь не найден." });
      }
      return res.send(user);
      )}
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
