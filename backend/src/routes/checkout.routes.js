// src/routes/checkout.routes.js
const router = require("express").Router();
const { authenticate } = require("../middlewares/auth.middleware");
const { fakeCheckout } = require("../controllers/checkout.controller");

router.post("/fake", authenticate, fakeCheckout);

module.exports = router;