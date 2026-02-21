const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate, isAdmin } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const {
  createUserSchema,
  updateUserSchema,
  updateMeSchema,
} = require("../validators/user.validator");


router.get("/me", authenticate, userController.getMe);
router.put("/me", authenticate, validate(updateMeSchema), userController.updateMe);
router.delete("/me", authenticate, userController.deleteMe);

router.get("/", authenticate, isAdmin, userController.getAllUsers);
router.post("/", authenticate, isAdmin, validate(createUserSchema), userController.createUser);
router.put("/:id", authenticate, isAdmin, validate(updateUserSchema), userController.updateUser);
router.delete("/:id", authenticate, isAdmin, userController.deleteUser);

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);


module.exports = router;
