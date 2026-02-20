const express = require("express");
const router = express.Router();
const machineController = require("../controllers/machine.controller");
const { uploadMachineImage } = require("../middlewares/upload.middleware");
const coffeeController = require("../controllers/coffee.controller");


router.get("/", machineController.getAllMachines);
router.get("/:id", machineController.getMachineById);
router.post(
  "/",
  uploadMachineImage.array("images", 5), // accept up to 5 images
  machineController.createMachine
);
router.put(
  "/:id",
  uploadMachineImage.array("images", 5), // optional, accept multiple
  machineController.updateMachine
);

router.delete("/:id", machineController.deleteMachine);

router.get("/best-sellers", coffeeController.getBestSellers);


module.exports = router;