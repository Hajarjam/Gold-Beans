const express = require("express");
const router = express.Router();
const historyController = require("../controllers/history.controller");

router.get("/:clientId", historyController.getSubscriptionHistory);

router.get("/:clientId/preview", historyController.getSubscriptionHistoryPreview);

module.exports = router;
