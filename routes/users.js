const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middleware/auth');
const userControllers = require('../controllers/users');

// возвращает всех пользователей
userRouter.get('/', auth, userControllers.getUsers);
// возвращает информацию о текущем пользователе
userRouter.get('/me', auth, userControllers.getUsersMe);
// возвращает пользователя по _id
userRouter.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().alphanum().length(24),
    }),
  }),
  userControllers.getUsersById,
);
// обновляет профиль
userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  userControllers.patchUserMe,
);
// обновляет аватар
userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .required()
        .pattern(/^https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=]*$/i),
    }),
  }),
  userControllers.patchUserMeAvatar,
);

module.exports = userRouter;
