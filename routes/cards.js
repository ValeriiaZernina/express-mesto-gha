const cardRouter = require("express").Router();
const cardControllers = require("../controllers/cards");

// создаёт карточку
cardRouter.post("/", cardControllers.createCard);
// возвращает все карточки
cardRouter.get("/", cardControllers.getCards);
// удаляет карточку по идентификатору
cardRouter.delete("/:cardId", cardControllers.deleteCard);

// поставить лайк карточке
cardRouter.put("/:cardId/likes", cardControllers.likeCard);
// убрать лайк с карточки
cardRouter.delete("/:cardId/likes", cardControllers.dislikeCard);

module.exports = cardRouter;
