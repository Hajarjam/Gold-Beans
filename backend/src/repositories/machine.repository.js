// src/services/machines.service.js
const Machine = require("../models/machine.model");
// Get all machines
const getAllMachines = async ({ search = "", sort = "nameAsc" } = {}) => {
  const q = search
    ? { name: { $regex: String(search), $options: "i" } }
    : {};

  let sortObj = { name: 1 };
  if (sort === "priceAsc") sortObj = { price: 1 };
  if (sort === "priceDesc") sortObj = { price: -1 };
  if (sort === "nameDesc") sortObj = { name: -1 };
  if (sort === "stockAsc") sortObj = { stock: 1 };
  if (sort === "stockDesc") sortObj = { stock: -1 };

  return Machine.find(q).sort(sortObj);
}; 

// Get one machine by ID
const getMachineById = (id) => Machine.findById(id);

// Create a machine
const createMachine = (data) => Machine.create(data);

// Update a machine
const updateMachine = (id, data) => Machine.findByIdAndUpdate(id, data, { new: true });

// Delete a machine
const deleteMachine = (id) => Machine.findByIdAndDelete(id);

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
};
