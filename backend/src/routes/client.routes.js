const router = require("express").Router();
const clientController = require("../controllers/client.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.get("/me/addresses", authenticate, clientController.getMyAddresses);
router.post("/me/addresses", authenticate, clientController.addMyAddress);

module.exports = router;
