const { StatusNotFound } = require('../utils/errors/StatusNotFound');
const { StatusBadRequest } = require('../utils/errors/StatusBadRequest');
const { ForbiddenError } = require('../utils/errors/ForbiddenError');
const { STATUS_CREATED } = require('../utils/errors/errorsCode');
const cardModel = require('../models/card');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  cardModel
    .create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new StatusBadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  cardModel
    .find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId: id } = req.params;
  cardModel
    .findById(id)
    .orFail(() => {
      throw new StatusNotFound('Ничего не удалилось.');
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError();
      }
      return card.deleteOne();
    })
    .then(() => res.send({ message: 'Карточка удалена.' }))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new StatusNotFound('ID карточки передан некорректно.');
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true, runValidators: true },
    )
    .orFail(() => {
      throw new StatusNotFound('Данное действие вам недоступно.');
    })
    .then((card) => res.send(card))
    .catch(next);
};
