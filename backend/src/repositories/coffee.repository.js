// src/services/coffees.service.js
const Coffee = require("../models/coffee.model");
// Get all coffees
const getAllCoffees = async ({ search = "", sort = "nameAsc" } = {}) => {
  const q = search
    ? { name: { $regex: String(search), $options: "i" } }
    : {};

  let sortObj = { name: 1 };
  if (sort === "priceAsc") sortObj = { price: 1 };
  if (sort === "priceDesc") sortObj = { price: -1 };
  if (sort === "nameDesc") sortObj = { name: -1 };
  if (sort === "stockAsc") sortObj = { stock: 1 };
  if (sort === "stockDesc") sortObj = { stock: -1 };

  return Coffee.find(q).sort(sortObj);
};

// Get one coffee by ID
const getCoffeeById = (id) => Coffee.findById(id);

// Create a coffee
const createCoffee = (data) => Coffee.create(data);

// Update a coffee
const updateCoffee = (id, data) => Coffee.findByIdAndUpdate(id, data, { new: true });

// Delete a coffee
const deleteCoffee = (id) => Coffee.findByIdAndDelete(id);

module.exports = {
  getAllCoffees,
  getCoffeeById,
  createCoffee,
  updateCoffee,
  deleteCoffee,
};
