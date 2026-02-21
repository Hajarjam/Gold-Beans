const User = require("../models/user.model");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findByEmail = (email) => {
  const normalizedEmail = String(email || "").trim();
  if (!normalizedEmail) return null;

  return User.findOne({
    email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
  });
};
const createUser = (data) => new User(data).save();//Sauvegarde le document dans MongoDB.
const findAll = (filter = {}) =>
  User.find(filter).select("firstName lastName email role isActive createdAt updatedAt").lean();
const findByResetToken = (token) =>
  User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

const findById = (id) => User.findById(id);
const findByActivationToken = (token) => User.findOne({ activationToken: token });
const updateUser = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true, runValidators: true })
    .select("firstName lastName email role isActive createdAt updatedAt");
const deleteUser = (id) => User.findByIdAndDelete(id);


module.exports = {
  findByEmail,
  createUser,
  findAll,
  findByResetToken,
  findById,
  findByActivationToken,
  updateUser,
  deleteUser,
};
