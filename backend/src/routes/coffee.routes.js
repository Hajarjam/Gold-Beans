const express = require("express");
const router = express.Router();

const coffeeController = require("../controllers/coffee.controller");
const { uploadCoffeeImage } = require("../middlewares/upload.middleware");

router.get("/", coffeeController.getAllCoffees);
router.get("/best-sellers", coffeeController.getBestSellers);
router.get("/:id", coffeeController.getCoffeeById);

router.post(
  "/",
  uploadCoffeeImage.single("image"),
  coffeeController.createCoffee
);


router.put(
  "/:id",
  uploadCoffeeImage.single("image"),
  coffeeController.updateCoffee
);

router.delete("/:id", coffeeController.deleteCoffee);

module.exports = router;
