const coffeeService = require("../services/coffee.service");
const Coffee = require("../models/coffee.model");
const fs = require("fs");
const path = require("path");

// GET all coffees
const getAllCoffees = async (req, res) => {
  try {
const coffees = await coffeeService.getAllCoffees();

    // Build full image URLs for frontend
 const coffeesWithFullImages = coffees.map(coffee => ({
      ...coffee._doc,
      images: coffee.images.map(
        img => `http://localhost:5001/uploads/coffees/${path.basename(img)}`
      ),
    }));
res.json(coffeesWithFullImages);

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

    // Build full image URLs
    coffee.images = coffee.images.map(img => `${img}`);

    res.json(coffee);
  } catch (err) {
    next(err);
  }
};


const normalizeTasteProfile = (tp) => {
  if (Array.isArray(tp)) return tp.map(s => String(s).trim()).filter(Boolean);
  if (typeof tp === "string")
    return tp.split(",").map(s => s.trim()).filter(Boolean);
  return [];
};

const normalizeImages = (req) => {
  // si upload fichier (multer)
  if (req.file) return [req.file.filename];

  // si JSON (ton cas actuel)
  if (Array.isArray(req.body.images)) return req.body.images;
  if (typeof req.body.images === "string" && req.body.images.trim())
    return [req.body.images.trim()];

  return [];
};
// CREATE new coffee
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
      tasteProfile: normalizeTasteProfile(req.body.tasteProfile),
      images: normalizeImages(req),
    };

    const coffee = await coffeeService.createCoffee(data);
    return res.status(201).json(coffee);
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
      tasteProfile: normalizeTasteProfile(req.body.tasteProfile),
    };

    const imgs = normalizeImages(req);
    if (imgs.length) data.images = imgs;

    const coffee = await coffeeService.updateCoffee(req.params.id, data);
    if (!coffee) return res.status(404).json({ message: "Coffee not found" });

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

    // Delete all images if exist
    if (coffee.images?.length) {
      coffee.images.forEach(img => {
        const imagePath = path.join(process.cwd(), "/uploads/coffees", img);
        fs.unlink(imagePath, err => {
          if (err) console.warn("Impossible de supprimer l'image :", err.message);
        });
      });
    }

    await coffeeService.deleteCoffee(req.params.id);
    res.json({ message: "Produit supprimé" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllCoffees,
  getCoffeeById,
  createCoffee,
  updateCoffee,
  deleteCoffee,
};
