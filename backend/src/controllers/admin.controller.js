const adminService = require("../services/admin.service");

const getAllAdmins = async (req, res, next) => {
  try {
    const { search = "", sort = "firstNameAsc" } = req.query;
    const admins = await adminService.getAllAdmins({ search, sort });
    res.json(admins);
  } catch (err) {
    next(err);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const created = await adminService.createAdmin(req.body);
    res.status(201).json({ message: "Admin créé", data: created });
  } catch (err) {
    next(err);
  }
};

const updateAdmin = async (req, res, next) => {
  try {
    const updated = await adminService.updateAdmin(req.params.id, req.body);
    res.json({ message: "Admin modifié", data: updated });
  } catch (err) {
    next(err);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    await adminService.deleteAdmin(req.params.id);
    res.json({ message: "Admin supprimé" });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    // req.user.id لازم تجيه من middleware auth
    const profile = await adminService.getMyAdminProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllAdmins, createAdmin, updateAdmin, deleteAdmin, me };
