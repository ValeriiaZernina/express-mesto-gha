const userRouter = require('express').Router();
const userControllers = require('../controllers/users');

// создаёт пользователя
userRouter.post('/', userControllers.createUser);
// возвращает всех пользователей
userRouter.get('/', userControllers.getUsers);
// возвращает мой профиль
userRouter.get('/me', userControllers.getUsersMe);
// возвращает пользователя по _id
userRouter.get('/:id', userControllers.getUsersById);
// обновляет профиль
userRouter.patch('/me', userControllers.patchUserMe);
// обновляет аватар
userRouter.patch('/me/avatar', userControllers.patchUserMeAvatar);

module.exports = userRouter;
