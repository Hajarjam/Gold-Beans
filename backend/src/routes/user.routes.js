const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");


router.get("/me", authenticate, userController.getMe);
router.put("/me", authenticate, userController.updateMe);
router.delete("/me", authenticate, userController.deleteMe);


router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);


module.exports = router;
