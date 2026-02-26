const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { uploadAvatarImage } = require("../middlewares/upload.middleware");

router.use(authenticate);

router.get("/dashboard", clientController.getDashboard);
router.get("/profile", clientController.getProfile);
router.put("/profile", clientController.updateProfile);
router.put("/password", clientController.updatePassword);
router.post("/avatar", uploadAvatarImage.single("avatar"), clientController.uploadAvatar);
router.delete("/account", clientController.deleteAccount);

router.get("/me/addresses", authenticate, clientController.getMyAddresses);
router.post("/me/addresses", authenticate, clientController.addMyAddress);

module.exports = router;
