class UnauthorizedStatus extends Error {
  constructor(message = 'Неверный логин или пароль') {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = {
  UnauthorizedStatus,
};
