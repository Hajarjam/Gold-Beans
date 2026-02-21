const Client = require("../models/client.model");

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findByEmail = (email) => {
  const normalizedEmail = String(email || "").trim();
  if (!normalizedEmail) return null;

  return Client.findOne({
    email: { $regex: `^${escapeRegex(normalizedEmail)}$`, $options: "i" },
  });
};
const createClient = (data) => new Client(data).save();
const createUser = (data) => createClient(data);
const findByResetToken = (token) =>
  Client.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

const findById = (id) => Client.findById(id);
const findByActivationToken = (token) => Client.findOne({ activationToken: token });
const updateClient = (id, data) => Client.findByIdAndUpdate(id, data, { new: true });
const deleteClient = (id) => Client.findByIdAndDelete(id);


module.exports = {
  findByEmail,
  createClient,
  createUser,
  findByResetToken,
  findById,
  findByActivationToken,
  updateClient,
  deleteClient,
};
