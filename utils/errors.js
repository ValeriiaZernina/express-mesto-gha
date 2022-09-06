/* eslint-disable max-classes-per-file */

class ApplicationError extends Error {
  constructor(status = 500, message = 'Где-то возникла ошибка!') {
    super();
    this.status = status;
    this.message = message;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

class StatusBadRequest extends ApplicationError {
  constructor(message = 'Неверный логин или пароль') {
    super(message);
    this.statusCode = 400;
  }
}

class UnauthorizedStatus extends ApplicationError {
  constructor(message = 'Неверный логин или пароль') {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenError extends ApplicationError {
  constructor(message = 'Не можете удалить чужую карточку') {
    super(message);
    this.statusCode = 403;
  }
}

class StatusNotFound extends ApplicationError {
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
