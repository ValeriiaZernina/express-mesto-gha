const jwt = require("jsonwebtoken");
const UNAUTHORIZED_STATUS = require("../utils/errorsCode");

module.exports = (req, res, next) => {
  // тут вся авторизация
  const { jwt: token } = req.cookies;

  if (!token) {
    throw new UNAUTHORIZED_STATUS("Необходима авторизация");
  }
  let payload;
  try {
    // верифицируем токен
    payload = jwt.verify(token, "some-secret-key");
  } catch (err) {
    res.clearCookie("jwt");
    throw new UNAUTHORIZED_STATUS("Необходима авторизация");
  }
  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
