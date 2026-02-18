// src/services/machines.service.js
const machineRepository = require("../repositories/machine.repository");

const getAllMachines = ({ search = "", sort = "nameAsc" } = {}) =>
  machineRepository.getAllMachines({ search, sort });
const getMachineById = (id) => machineRepository.getMachineById(id);
const createMachine = (data) => machineRepository.createMachine(data);
const updateMachine = (id, data) => machineRepository.updateMachine(id, data);
const deleteMachine = (id) => machineRepository.deleteMachine(id);

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
}; 
