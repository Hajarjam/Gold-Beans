const express = require("express");
const router = express.Router();
const { getDashboardStats, getSalesMonth, getSalesWeek, getSalesYear, getBestSellers,getSalesRange } = require("../controllers/coffee.controller");
const{getBestSellingMachines} = require("../controllers/machine.controller")
router.get("/", getDashboardStats);
router.get("/sales/month", getSalesMonth);
router.get("/sales/week", getSalesWeek);
router.get("/sales/year", getSalesYear);
router.get("/sales/range",getSalesRange);
router.get("/best-selling-machines", getBestSellingMachines);


// GET top 3 best sellers
router.get("/best-sellers",getBestSellers);

module.exports = router;

