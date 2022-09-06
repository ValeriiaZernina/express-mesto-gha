function handleError(err, req, res, next) {
  const { name, message, code = 0 } = err;
  let { statusCode = 500 } = err;
  if (name === 'CastErrior' || name === 'ValidationError') {
    statusCode = 400;
  } else if (code === 11000) {
    statusCode = 409;
  }

  res.status(statusCode).send({ message: `${name}: ${message}` });
  next();
}

module.exports = { handleError };
