const User = require("../models/user.model");

const findByEmail = (email) => User.findOne({ email });
const createUser = (data) => new User(data).save();//Sauvegarde le document dans MongoDB.
const findByResetToken = (token) =>
  User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

const findById = (id) => User.findById(id);
const findByActivationToken = (token) => User.findOne({ activationToken: token });


module.exports = {
  findByEmail,
  createUser,
  findByResetToken,
  findById,
  findByActivationToken
};