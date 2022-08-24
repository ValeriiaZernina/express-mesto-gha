const userModel = require("../models/user");

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userModel
    .create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => res.send(users))
    .catch((err) =>
      res.status(500).send({ message: `${err.name}: ${err.message}` })
    );
};

module.exports.getUsersById = (req, res) => {
  userModel
    .findById(req.params.id)
    .then((user) => res.send(user))
    .catch((err) =>
      res.status(500).send({ message: `${err.name}: ${err.message}` })
    );
};
