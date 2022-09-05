class Status_bad_request extends Error {
  constructor(message = "Неверный логин или пароль") {
    super(message);
    this.statusCode = 400;
  }
}

class Unauthorized_status extends Error {
  constructor(message = "Неверный логин или пароль") {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenError extends ApplicationError {
  constructor(message = "Не можете удалить чужую карточку") {
    super(message);
    this.statusCode = 403;
  }
}

class Status_not_found extends Error {
  constructor(message = "Запрашиваемый пользователь не найден.") {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = {
  Status_bad_request,
  Unauthorized_status,
  ForbiddenError,
  Status_not_found,
};
