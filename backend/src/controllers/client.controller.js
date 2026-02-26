const clientService = require("../services/client.service");

const getDashboard = async (req, res, next) => {
  try {
    const data = await clientService.getDashboard(req.user.id, req.user.email);
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const getMyAddresses = async (req, res, next) => {
  try {
    const addresses = await clientService.getAddresses(req.user.id, req.user.email);
    res.json(addresses);
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const client = await clientService.getProfile(req.user.id, req.user.email);
    res.json(client);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const client = await clientService.updateProfile(req.user.id, req.body, req.user.email);
    res.json({ message: "Profile updated", data: client });
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const result = await clientService.updatePassword(req.user.id, req.body, req.user.email);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const uploadAvatar = async (req, res, next) => {
  try {
    const updatedClient = await clientService.uploadAvatar(
      req.user.id,
      req.file,
      req.user.email,
    );
    res.json({ message: "Avatar updated", data: updatedClient });
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const result = await clientService.deleteAccount(req.user.id, req.user.email);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const addMyAddress = async (req, res, next) => {
  try {
    const { street, city, zip, country } = req.body;

    if (!street || !city || !zip) {
      return res.status(400).json({ message: "street, city, zip are required" });
    }

    const newAddress = await clientService.addAddress(
      req.user.id,
      {
      street,
      city,
      zip,
      country: country || "Morocco",
      },
      req.user.email
    );

    res.status(201).json({ message: "Address added", data: newAddress });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  updatePassword,
  uploadAvatar,
  deleteAccount,
  getMyAddresses,
  addMyAddress,
};
