const authService = require("../services/auth.service");

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role, extraData } = req.body;
    const createdBy = req.user?._id || null;
    await authService.register({ firstName, lastName, email, password, role, extraData, createdBy });
    res.status(201).json({ message: "Account created. Check your email for activation." });
  } catch (err) {
    next(err);
  }
};

const activateAccount = async (req, res, next) => {
  try {
    await authService.activateAccount(req.params.token);
    res.json({ message: "Account activated!" });
  } catch (err) {
    next(err); 
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const result = await authService.login({ email, password } );
    res.json(result);
  } catch (err) {
    next(err); 
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.json({ message: "Password reset email sent!" });
  } catch (err) {
    next(err); 
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.params.token, req.body.password);
    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    next(err); 
  }
};

const verifyToken = async (req, res, next) => {
  res.json({ message: "Token valide", user: req.user });
};
/*Si cette fonction est appelée, ça veut dire :
 le token est valide
 le middleware JWT est passé */
const getCurrentUser = async (req, res, next) => {
  res.json({ user: req.user });
};
/*Renvoie les infos de l’utilisateur connecté

Sans refaire de requête DB */

module.exports = {
  register,
  activateAccount,
  login,
  forgotPassword,
  resetPassword,
  verifyToken,
  getCurrentUser,
};
