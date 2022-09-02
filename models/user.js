const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs"); // импортируем bcrypt
const { UNAUTHORIZED_STATUS } = require("../utils/errorsCode");

const userSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default:
      "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  email: {
    type: String,
    required: [true, "Please enter Email"],
    unique: true,
    validate: [validator.isEmail, "Invalid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: [5, "Password must be at least 6 characters"],
  },
});

userSchema.static.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UNAUTHORIZED_STATUS("Email or password is incorrect")
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UNAUTHORIZED_STATUS("Email or password is incorrect")
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
