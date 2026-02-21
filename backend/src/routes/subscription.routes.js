const express = require("express");
const router = express.Router();

const subscriptionController = require("../controllers/subscription.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.use(authenticate);

router.get("/", subscriptionController.getUserSubscriptions);
router.get("/preview", subscriptionController.getSubscriptionPreview);
router.post("/", subscriptionController.createSubscription);
router.put("/:id/cancel", subscriptionController.cancelSubscription);

module.exports = router;