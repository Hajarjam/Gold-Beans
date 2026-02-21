const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const clientRepo = require("../repositories/client.repository");
const userRepo = require("../repositories/user.repository");
const sendEmail = require("../utils/email");
const Client = require("../models/client.model");
const User = require("../models/user.model");

const normalizeRole = (role) => (role === "user" ? "client" : role);
const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const findAccountByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email);

  const client = await clientRepo.findByEmail(normalizedEmail);
  if (client) return { account: client, source: "client", normalizedEmail };

  const user = await userRepo.findByEmail(normalizedEmail);
  if (user) return { account: user, source: "user", normalizedEmail };

  return { account: null, source: null, normalizedEmail };
};

const findAccountByResetToken = async (token) => {
  const client = await clientRepo.findByResetToken(token);
  if (client) return client;

  return userRepo.findByResetToken(token);
};

const findAccountByActivationToken = async (token) => {
  const client = await Client.findOne({ activationToken: token });
  if (client) return client;

  return User.findOne({ activationToken: token });
};

const register = async ({ firstName, lastName, email, password, role, createdBy }) => {
  const normalizedEmail = normalizeEmail(email);
  const existing = await clientRepo.findByEmail(normalizedEmail);
  if (existing) throw new Error("Email deja utilise");

  const activationToken = crypto.randomBytes(32).toString("hex");

  const user = await clientRepo.createUser({
    firstName,
    lastName,
    email: normalizedEmail,
    password,
    role: "client",
    activationToken,
    createdBy: createdBy || null,
  });

  const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
  await sendEmail(normalizedEmail, "Activation du compte", `Cliquez ici pour activer : ${activationLink}`);

  return user;
};

const activateAccount = async (token) => {
  const user = await findAccountByActivationToken(token);
  if (!user) {
    const alreadyActivatedClient = await Client.findOne({
      activationToken: null,
      isActive: true,
    });

    const alreadyActivatedUser = await User.findOne({
      activationToken: null,
      isActive: true,
    });

    if (alreadyActivatedClient || alreadyActivatedUser) return;
    throw new Error("Token invalide ou expire");
  }

  user.isActive = true;
  user.activationToken = null;
  await user.save();
};

const login = async ({ email, password }) => {
  const { account: user, source } = await findAccountByEmail(email);

  if (!user) throw new Error("Utilisateur non trouve");
  if (!user.isActive) throw new Error("Compte non active");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Mot de passe incorrect");

  const token = jwt.sign(
    { id: user._id, source: source || "client" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: normalizeRole(user.role),
    },
  };
};

const forgotPassword = async (email) => {
  const { account: user } = await findAccountByEmail(email);
  if (!user) throw new Error("Utilisateur non trouve");

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600 * 1000;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail(user.email, "Reinitialisation mot de passe", `Cliquez ici pour reinitialiser : ${resetLink}`);
};

const resetPassword = async (token, newPassword) => {
  const user = await findAccountByResetToken(token);
  if (!user) throw new Error("Token invalide ou expire");

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
};

module.exports = {
  register,
  activateAccount,
  login,
  forgotPassword,
  resetPassword,
};
