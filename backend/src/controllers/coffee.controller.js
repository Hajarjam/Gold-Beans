const coffeeService = require("../services/coffee.service");
const Coffee = require("../models/coffee.model");
const Machine = require("../models/machine.model");
const Subscription = require("../models/subscription.model");
const fs = require("fs");
const path = require("path");

/* =========================
   HELPERS
========================= */

const buildImageUrl = (img) =>
  `http://localhost:5001/uploads/coffees/${img}`;

const formatSales = (agg, key) =>
  agg.map((item) => ({
    [key]: item._id.toString(),
    sales: item.total,
  }));

/* =========================
   COFFEES CRUD
========================= */

// GET all coffees
const getAllCoffees = async (req, res) => {
  try {
    const coffees = await coffeeService.getAllCoffees();

    const coffeesWithImages = coffees.map((coffee) => ({
      ...coffee._doc,
      images: coffee.images.map(buildImageUrl),
    }));

    res.json(coffeesWithImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET coffee by ID
const getCoffeeById = async (req, res, next) => {
  try {
    const coffee = await coffeeService.getCoffeeById(req.params.id);
    if (!coffee) return res.status(404).json({ message: "Coffee not found" });

    coffee.images = coffee.images.map(buildImageUrl);
    res.json(coffee);
  } catch (err) {
    next(err);
  }
};

// CREATE coffee
const createCoffee = async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      description: req.body.description,
      origin: req.body.origin,
      roastLevel: req.body.roastLevel,
      intensity: Number(req.body.intensity),
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      tasteProfile: req.body.tasteProfile
        ? req.body.tasteProfile.split(",").map((s) => s.trim())
        : [],
      images: req.file ? [req.file.filename] : [],
    };

    const coffee = await coffeeService.createCoffee(data);
    coffee.images = coffee.images.map(buildImageUrl);

    res.status(201).json(coffee);
  } catch (error) {
    next(error);
  }
};

// UPDATE coffee
const updateCoffee = async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      description: req.body.description,
      origin: req.body.origin,
      roastLevel: req.body.roastLevel,
      intensity: Number(req.body.intensity),
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      tasteProfile: req.body.tasteProfile
        ? req.body.tasteProfile.split(",").map((s) => s.trim())
        : [],
    };

    if (req.file) {
      data.images = [req.file.filename];
    }

    const coffee = await coffeeService.updateCoffee(req.params.id, data);
    if (!coffee) return res.status(404).json({ message: "Coffee not found" });

    coffee.images = coffee.images.map(buildImageUrl);
    res.json(coffee);
  } catch (error) {
    next(error);
  }
};

// DELETE coffee
const deleteCoffee = async (req, res, next) => {
  try {
    const coffee = await coffeeService.getCoffeeById(req.params.id);
    if (!coffee) return res.status(404).json({ message: "Produit introuvable" });

    if (coffee.images?.length) {
      coffee.images.forEach((img) => {
        const imagePath = path.join(
          process.cwd(),
          "uploads",
          "coffees",
          img
        );
        fs.unlink(imagePath, (err) => {
          if (err) console.warn("Image delete error:", err.message);
        });
      });
    }

    await coffeeService.deleteCoffee(req.params.id);
    res.json({ message: "Produit supprimé" });
  } catch (err) {
    next(err);
  }
};

/*
   DASHBOARD
*/

const getDashboardStats = async (req, res) => {
  try {
    const totalCoffees = await Coffee.countDocuments();
    const totalMachines = await Machine.countDocuments();

    const coffeeAgg = await Coffee.aggregate([
      {
        $project: {
          revenue: {
            $multiply: [
              { $ifNull: ["$sales", 0] }, // FIXED (lowercase)
              { $ifNull: ["$price", 0] },
            ],
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$revenue" } } },
    ]);

    const machineAgg = await Machine.aggregate([
      {
        $project: {
          revenue: {
            $multiply: [
              { $ifNull: ["$sales", 0] },
              { $ifNull: ["$price", 0] },
            ],
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$revenue" } } },
    ]);

    const totalRevenue =
      (coffeeAgg[0]?.total || 0) + (machineAgg[0]?.total || 0);

    const activeSubscriptions = await Subscription.countDocuments({
      isActive: true,
    });

    const cancelledSubscriptions = await Subscription.countDocuments({
      isCancelled: true,
    });

    res.json({
      totalCoffees,
      totalMachines,
      totalRevenue,
      activeSubscriptions,
      cancelledSubscriptions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* =========================
   SALES
========================= */

// Top 3 best sellers
const getBestSellers = async (req, res) => {
  try {
    const coffees = await Coffee.find().sort({ sales: -1 }).limit(3);

    const result = coffees.map((coffee) => ({
      _id: coffee._id,
      name: coffee.name,
      tasteProfile: coffee.tasteProfile,
      roast: coffee.roastLevel,
      sales: coffee.sales || 0,
      image: coffee.images[0]
        ? buildImageUrl(coffee.images[0])
        : null,
      images: coffee.images.map(buildImageUrl),
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch best sellers" });
  }
};

// Monthly sales (daily)
const getSalesMonth = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const sales = await Subscription.aggregate([
      {
        $match: {
          isActive: true,
          isCancelled: false,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Africa/Casablanca",
            },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const daysInMonth = end.getDate();
    const result = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = `${start.getFullYear()}-${String(
        start.getMonth() + 1
      ).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      const found = sales.find((s) => s._id === date);
      result.push({ day: d.toString(), sales: found ? found.total : 0 });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSalesWeek = async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const sales = await Subscription.aggregate([
      {
        $match: {
          isActive: true,
          isCancelled: false,
          createdAt: { $gte: start, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Africa/Casablanca",
            },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);

      const key = d.toISOString().split("T")[0];
      const found = sales.find((s) => s._id === key);

      result.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        sales: found ? found.total : 0,
      });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// Yearly sales
const getSalesYear = async (req, res) => {
  try {
    const year = new Date().getFullYear();

    const sales = await Subscription.aggregate([
      {
        $match: {
          isActive: true,
          isCancelled: false,
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lte: new Date(year, 11, 31, 23, 59, 59),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const result = months.map((m, i) => {
      const found = sales.find((s) => s._id === i + 1);
      return { month: m, sales: found ? found.total : 0 };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// CUSTOM DATE RANGE SALES
const getSalesRange = async (req, res) => {
  try {
    const { from, to } = req.query;

    const start = new Date(from);
    const end = new Date(to);

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    let groupFormat = "%Y-%m-%d";
    let label = "day";

    if (diffDays > 60 && diffDays <= 365) {
      groupFormat = "%Y-%U"; // week
      label = "week";
    } else if (diffDays > 365) {
      groupFormat = "%Y-%m"; // month
      label = "month";
    }

    const sales = await Subscription.aggregate([
      {
        $match: {
          isActive: true,
          isCancelled: false,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: groupFormat,
              date: "$createdAt",
              timezone: "Africa/Casablanca",
            },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ label, data: sales });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================
   EXPORTS
========================= */

module.exports = {
  getAllCoffees,
  getCoffeeById,
  createCoffee,
  updateCoffee,
  deleteCoffee,
  getBestSellers,
  getSalesYear,
  getSalesWeek,
  getSalesMonth,
  getDashboardStats,
  getSalesRange,
};
