const jwt = require('jsonwebtoken');
const { UnauthorizedStatus } = require('../utils/errors');

module.exports = (req, res, next) => {
  // тут вся авторизация
  const { jwt: token } = req.cookies;

  if (!token) {
    throw new UnauthorizedStatus('Необходима авторизация');
  }
  let payload;
  try {
    // верифицируем токен
    payload = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(payload);
  } catch (err) {
    res.clearCookie('jwt');
    throw new UnauthorizedStatus('Необходима авторизация');
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
