const express = require("express");
const router = express.Router();

const machineController = require("../controllers/machine.controller");
const { uploadMachineImage } = require("../middlewares/upload.middleware");

router.get("/", machineController.getAllMachines);
router.get("/:id", machineController.getMachineById);

router.post("/", uploadMachineImage.single("image"), machineController.createMachine);
router.put("/:id", uploadMachineImage.single("image"), machineController.updateMachine);

router.delete("/:id", machineController.deleteMachine);

module.exports = router;
