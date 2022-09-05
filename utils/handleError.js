function handleError(err, req, res, next) {
  const { name, message, code = 0 } = err;
  let { status = 500 } = err;
  if (name === "CastErrior" || name === "ValidationError") {
    status = 400;
  } else if (code === 11000) {
    status = 409;
  }

  res.status(status).send({ message: `${name}: ${message}` });
  next();
}

module.exports = { handleError };
