const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userRepo = require("../repositories/user.repository");
const sendEmail = require("../utils/email");
const User = require("../models/user.model");
const Client = require("../models/client.model")

 const register = async ({ firstName, lastName, email, password, role, extraData, createdBy }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw new Error("Email déjà utilisé");

  const activationToken = crypto.randomBytes(32).toString("hex");//➡️ Crée une clé unique (ex: a3f9...) qui sera mise dans le lien envoyé par email.

  const user = await userRepo.createUser({
    firstName,
    lastName,
    email,
    password,
    role,
    activationToken,
    createdBy: createdBy || null,
  }); 

  // Création du document spécifique selon le rôle
  if (role === "client") {
    await Client.create({ userId: user._id, addresses: extraData?.addresses || [] }); //extraData = des infos en plus envoyées par le frontend
  }

  // Envoi email activation
  const activationLink = `${process.env.FRONTEND_URL}/activate/${activationToken}`; 
  await sendEmail(email, "Activation du compte", `Cliquez ici pour activer : ${activationLink}`);/***Envoie un email à l’utilisateur :À : son email Sujet : Activation du compte Message : */

  return user;
};

const activateAccount = async (token) => {//token → jeton d’activation envoyé par email
  const user = await User.findOne({ activationToken: token });/*On cherche dans la base : un utilisateur qui possède ce token d’activation */
  if (!user) {/*Si aucun utilisateur n’est trouvé if (!user) {  Ça veut dire : le token est faux ou déjà utilisé ou expiré */
    const alreadyActivated = await User.findOne({
      activationToken: null,
      isActive: true,
    });

    if (alreadyActivated) {
      return; //“Ton compte est déjà activé, tout va bien.”
    }

    throw new Error("Token invalide ou expiré");
  }

  user.isActive = true;
  user.activationToken = null;//Le token est supprimé pour : empêcher une réutilisation sécuriser
  await user.save();//On enregistre les changements dans la base.
};


const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Utilisateur non trouvé");
  if (!user.isActive) throw new Error("Compte non activé");/*Même si l’email et le mot de passe sont corrects : si le compte n’est pas activé → connexion interdite  Cas réel : “Veuillez activer votre compte via l’email reçu.” */ /*tokent sert a prouver que l’utilisateur est connecté accéder aux routes protégées */

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Mot de passe incorrect");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" }); /*On crée un JWT qui contient :l’ID de l’utilisateur */
  return { token, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } };
};

const forgotPassword = async (email) => {
  const user = await userRepo.findByEmail(email);
  if (!user) throw new Error("Utilisateur non trouvé");

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600 * 1000; // 1h
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail(email, "Réinitialisation mot de passe", `Cliquez ici pour réinitialiser : ${resetLink}`);
};

/*1️ L’utilisateur clique “Mot de passe oublié”
2️ Il entre son email
3️ Il reçoit un email
4️ Il clique sur le lien
5️ Il arrive sur la page “Nouveau mot de passe” */

const resetPassword = async (token, newPassword) => {
  const user = await userRepo.findByResetToken(token);
  if (!user) throw new Error("Token invalide ou expiré");
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
