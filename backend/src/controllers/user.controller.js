const userService = require("../services/user.service");

const getAllUsers = async (req, res, next) => {
  try {
    const { search = "", sort = "firstNameAsc", role = "" } = req.query;
    const users = await userService.getAllUsers({ search, sort, role });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const created = await userService.createUser(req.body);
    res.status(201).json({ message: "User créé", data: created });
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    res.json({ message: "User modifié", data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: "User supprimé" });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    // req.user vient de authenticate
    const me = await userService.getUserById(req.user.id);
    res.json(me);
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const updated = await userService.updateUser(req.user.id, req.body);
    res.json({ message: "Profil modifié", data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteMe = async (req, res, next) => {
  try {
    await userService.deleteUser(req.user.id);
    res.json({ message: "Compte supprimé" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser, getMe, updateMe, deleteMe };