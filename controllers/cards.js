const cardModel = require("../models/card");
const {
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL_SERVER_ERROR,
} = require("../utils/errorsCode");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  cardModel
    .create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(STATUS_BAD_REQUEST)
          .send({ message: "Некорректные данные при создании карточки." });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Что-то пошло не так!" });
      }
    });
};

module.exports.getCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res
        .status(STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: "Что-то пошло не так!" });
    });
};

module.exports.deleteCard = (req, res) => {
  cardModel
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(STATUS_NOT_FOUND)
          .send({ message: "Запрашиваемая карточка не найдена." });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные при удалении карточки.",
        });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Что-то пошло не так!" });
      }
    });
};

module.exports.likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true, runValidators: true }
    )
    .then((card) => {
      if (!card) {
        return res
          .status(STATUS_NOT_FOUND)
          .send({ message: "ID карточки передан некорректно." });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные для лайка.",
        });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Что-то пошло не так!" });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true, runValidators: true }
    )
    .then((card) => {
      if (!card) {
        return res
          .status(STATUS_NOT_FOUND)
          .send({ message: "ID карточки передан некорректно." });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(STATUS_BAD_REQUEST).send({
          message: "Переданы некорректные данные для дизлайка карточки.",
        });
      } else {
        res
          .status(STATUS_INTERNAL_SERVER_ERROR)
          .send({ message: "Что-то пошло не так!" });
      }
    });
};
