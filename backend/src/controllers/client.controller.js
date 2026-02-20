const clientService = require("../services/client.service");

const getMyAddresses = async (req, res, next) => {
  try {
    const addresses = await clientService.getAddresses(req.user.id);
    res.json(addresses);
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

    const newAddress = await clientService.addAddress(req.user.id, {
      street,
      city,
      zip,
      country: country || "Morocco",
    });

    res.status(201).json({ message: "Address added", data: newAddress });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMyAddresses, addMyAddress };
