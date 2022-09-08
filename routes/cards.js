const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const cardControllers = require('../controllers/cards');
const { regex } = require('../utils/regex ');

// создаёт карточку
cardRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(regex),
    }),
  }),
  cardControllers.createCard,
);
// возвращает все карточки
cardRouter.get('/', cardControllers.getCards);
// удаляет карточку по идентификатору
cardRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  cardControllers.deleteCard,
);

// поставить лайк карточке
cardRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  cardControllers.likeCard,
);
// убрать лайк с карточки
cardRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  cardControllers.dislikeCard,
);

module.exports = cardRouter;
