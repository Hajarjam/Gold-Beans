const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userRepo = require("../repositories/client.repository");
const sendEmail = require("../utils/email");
const User = require("../models/client.model");

const normalizeRole = (role) => (role === "user" ? "client" : role);

const register = async ({ firstName, lastName, email, password, role, createdBy }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error("Email deja utilise");

  const activationToken = crypto.randomBytes(32).toString("hex");

  const user = await userRepo.createUser({
    firstName,
    lastName,
    email,
    password,
    // Never accept elevated role from public register
    role: "client",
    activationToken,
    createdBy: createdBy || null,
  });

  const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`;
  await sendEmail(email, "Activation du compte", `Cliquez ici pour activer : ${activationLink}`);

  return user;
};

const activateAccount = async (token) => {
  const user = await User.findOne({ activationToken: token });
  if (!user) {
    const alreadyActivated = await User.findOne({
      activationToken: null,
      isActive: true,
    });

    if (alreadyActivated) return;
    throw new Error("Token invalide ou expire");
  }

  user.isActive = true;
  user.activationToken = null;
  await user.save();
};

const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Utilisateur non trouve");
  if (!user.isActive) throw new Error("Compte non active");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Mot de passe incorrect");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
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
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Utilisateur non trouve");

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600 * 1000;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail(email, "Reinitialisation mot de passe", `Cliquez ici pour reinitialiser : ${resetLink}`);
};

const resetPassword = async (token, newPassword) => {
  const user = await userRepo.findByResetToken(token);
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
