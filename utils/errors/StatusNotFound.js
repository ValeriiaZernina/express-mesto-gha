class StatusNotFound extends Error {
  constructor(message = 'Запрашиваемый пользователь не найден.') {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = {
  StatusNotFound,
};
