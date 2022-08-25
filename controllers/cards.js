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
      res.status(201).send(card);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.getCards = (req, res) => {
  cardModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) =>
      res.status(500).send({ message: `${err.name}: ${err.message}` })
    );
};

module.exports.deleteCard = (req, res) => {
  cardModel
    .findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ message: "Карточка удалена" });
      }
    })
    .catch((err) =>
      res.status(500).send({ message: `${err.name}: ${err.message}` })
    );
};

module.exports.likeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true }
    )
    .then((card) => {
      res.send(card);
    })
    .catch((err) =>
      res.status(500).send({ message: `${err.name}: ${err.message}` })
    );
};

module.exports.dislikeCard = (req, res) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true }
    )
    .then((card) => {
      res.send(card);
    })
    .catch((err) =>
      res.status(500).send({ message: `${err.name}: ${err.message}` })
    );
};
