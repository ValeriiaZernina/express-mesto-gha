class StatusBadRequest extends Error {
  constructor(message = 'Переданы некорректные данные') {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = {
  StatusBadRequest,
};
