class ForbiddenError extends Error {
  constructor(message = 'Не можете удалить чужую карточку') {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = {
  ForbiddenError,
};
