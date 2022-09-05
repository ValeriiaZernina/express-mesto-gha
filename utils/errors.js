class StatusBadRequest extends Error {
  constructor(message = 'Неверный логин или пароль') {
    super(message);
    this.statusCode = 400;
  }
}

class UnauthorizedStatus extends Error {
  constructor(message = 'Неверный логин или пароль') {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message = 'Не можете удалить чужую карточку') {
    super(message);
    this.statusCode = 403;
  }
}

class StatusNotFound extends Error {
  constructor(message = 'Запрашиваемый пользователь не найден.') {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = {
  StatusBadRequest,
  UnauthorizedStatus,
  ForbiddenError,
  StatusNotFound,
};
