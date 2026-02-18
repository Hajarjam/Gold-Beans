// controllers/machines.controller.js
const machineService = require("../services/machine.service");
const fs = require("fs");
const path = require("path");

const normalizeCoffeeTypes = (v) => {
  if (Array.isArray(v)) return v.map((s) => String(s).trim()).filter(Boolean);
  if (typeof v === "string") return v.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
};

const normalizeImages = (req) => {
  // upload fichier (multer)
  if (req.file) return [req.file.filename];

  // si jamais tu envoies images en JSON
  if (Array.isArray(req.body.images)) return req.body.images;
  if (typeof req.body.images === "string" && req.body.images.trim())
    return [req.body.images.trim()];

  return [];
};

const withFullImageUrls = (doc) => {
  const obj = doc?._doc ? { ...doc._doc } : { ...doc };

  return {
    ...obj,
    images: (obj.images || []).map(
      (img) => `${API_BASE_URL}/uploads/machines/${path.basename(img)}`
    ),
  };
};

// ✅ GET all machines
const getAllMachines = async (req, res, next) => {
  try {
    const { search = "", sort = "nameAsc" } = req.query;

    const machines = await machineService.getAllMachines({ search, sort });

    const machinesWithFullImages = machines.map(withFullImageUrls);

    res.json(machinesWithFullImages);
  } catch (err) {
    next(err);
  }
};

// ✅ GET machine by ID
const getMachineById = async (req, res, next) => {
  try {
    const machine = await machineService.getMachineById(req.params.id);
    if (!machine) return res.status(404).json({ message: "Machine not found" });

    res.json(withFullImageUrls(machine));
  } catch (err) {
    next(err);
  }
};

// ✅ CREATE new machine
const createMachine = async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      coffeeTypeSupported: normalizeCoffeeTypes(req.body.coffeeTypeSupported),
      images: normalizeImages(req),
    };

    const machine = await machineService.createMachine(data);

    res.status(201).json(withFullImageUrls(machine));
  } catch (err) {
    next(err);
  }
};

// ✅ UPDATE machine
const updateMachine = async (req, res, next) => {
  try {
    const data = {
      name: req.body.name,
      type: req.body.type,
      description: req.body.description,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      coffeeTypeSupported: normalizeCoffeeTypes(req.body.coffeeTypeSupported),
    };

    const imgs = normalizeImages(req);
    if (imgs.length) data.images = imgs;

    const updated = await machineService.updateMachine(req.params.id, data);
    if (!updated) return res.status(404).json({ message: "Produit introuvable" });

    res.json(withFullImageUrls(updated));
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE machine
const deleteMachine = async (req, res, next) => {
  try {
    const machine = await machineService.getMachineById(req.params.id);
    if (!machine) return res.status(404).json({ message: "Produit introuvable" });

    // 🔥 supprimer toutes les images (images[])
    if (machine.images?.length) {
      machine.images.forEach((img) => {
        const imagePath = path.join(process.cwd(), "uploads", "machines", path.basename(img));
        fs.unlink(imagePath, (err) => {
          if (err) console.warn("Impossible de supprimer l'image :", err.message);
        });
      });
    }

    await machineService.deleteMachine(req.params.id);
    res.json({ message: "machine supprimé" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
};
