const userRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const userControllers = require("../controllers/users");

// возвращает всех пользователей
userRouter.get("/", userControllers.getUsers);
// возвращает информацию о текущем пользователе
userRouter.get("/me", userControllers.getUsersMe);
// возвращает пользователя по _id
userRouter.get("/:id", userControllers.getUsersById);
// обновляет профиль
userRouter.patch("/me", userControllers.patchUserMe);
// обновляет аватар
userRouter.patch("/me/avatar", userControllers.patchUserMeAvatar);

module.exports = userRouter;
