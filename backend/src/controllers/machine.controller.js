const machineService = require("../services/machine.service");
const Machine = require("../models/machine.model");
const fs = require("fs");
const path = require("path");

const buildImageUrl = (img) =>
  img ? `${process.env.BASE_URL || "http://localhost:5001"}${img}` : null;


// GET all machines 
const getAllMachines = async (req, res, next) => {
  try {
    const { search = "", sort = "nameAsc" } = req.query;
    const machines = await machineService.getAllMachines({ search, sort });
    // Map images to full URLs so frontend can load them directly
    const mapped = machines.map((m) => {
      const obj = m.toObject ? m.toObject() : { ...m };
      obj.images = (obj.images || []).map(buildImageUrl);
      return obj;
    });
    res.json(mapped);
  } catch (err) {
    next(err);
  }
};


// GET machine by ID
const getMachineById = async (req, res, next) => {
  try {
    const machine = await machineService.getMachineById(req.params.id);
    if (!machine) return res.status(404).json({ message: "Machine not found" });
    const obj = machine.toObject ? machine.toObject() : { ...machine };
    obj.images = (obj.images || []).map(buildImageUrl);
    res.json(obj);
  } catch (err) {
    next(err);
  }
};

// CREATE new machine
const createMachine = async (req, res, next) => {
  try {
    const coffeeTypeSupported =
      Array.isArray(req.body.coffeeTypeSupported)
        ? req.body.coffeeTypeSupported
        : req.body.coffeeTypeSupported
        ? String(req.body.coffeeTypeSupported).split(",").map((s) => s.trim())
        : [];

    const images = Array.isArray(req.files)
      ? req.files.map((f) => `/uploads/machines/${f.filename}`)
      : req.file
      ? [`/uploads/machines/${req.file.filename}`]
      : [];

    const data = {
      name: String(req.body.name || "").trim(),
      type: String(req.body.type || "").trim(),
      description: String(req.body.description || "").trim(),
      coffeeTypeSupported,
      price: Number(req.body.price) || 0,
      stock: Number(req.body.stock) || 0,
      images,
    };

    const machine = await machineService.createMachine(data);
    // ensure images are full URLs for client
    machine.images = (machine.images || []).map(buildImageUrl);
    res.status(201).json(machine);
  } catch (err) {
    next(err);
  }
};

// UPDATE machine
const updateMachine = async (req, res, next) => {
  try {
    const machine = await machineService.getMachineById(req.params.id);
    if (!machine) return res.status(404).json({ message: "Machine not found" });

    const coffeeTypeSupported =
      Array.isArray(req.body.coffeeTypeSupported)
        ? req.body.coffeeTypeSupported
        : req.body.coffeeTypeSupported
        ? String(req.body.coffeeTypeSupported).split(",").map((s) => s.trim())
        : [];

    const data = {
      name: typeof req.body.name === "string" ? req.body.name.trim() : machine.name,
      type: typeof req.body.type === "string" ? req.body.type.trim() : machine.type,
      description:
        typeof req.body.description === "string" ? req.body.description.trim() : machine.description,
      coffeeTypeSupported: coffeeTypeSupported.length ? coffeeTypeSupported : machine.coffeeTypeSupported,
      price: Number(req.body.price) || machine.price,
      stock: Number(req.body.stock) || machine.stock,
    };

    // Handle new images (support multiple files)
    const newImages = Array.isArray(req.files)
      ? req.files.map((f) => `/uploads/machines/${f.filename}`)
      : req.file
      ? [`/uploads/machines/${req.file.filename}`]
      : null;

    if (newImages && newImages.length) {
      // Delete old images from disk if present
      if (Array.isArray(machine.images) && machine.images.length > 0) {
        machine.images.forEach((img) => {
          try {
            const oldImagePath = path.join(process.cwd(), img.replace(/^[\/]/, ""));
            fs.unlink(oldImagePath, (err) => {
              if (err) console.warn("Failed to delete old image:", err.message);
            });
          } catch (e) {
            console.warn("Error removing image:", e.message);
          }
        });
      }
      data.images = newImages;
    }

    const updatedMachine = await machineService.updateMachine(req.params.id, data);
    updatedMachine.images = (updatedMachine.images || []).map(buildImageUrl);

    res.json(updatedMachine);
  } catch (err) {
    next(err);
  }
};

// DELETE machine
const deleteMachine = async (req, res, next) => {
  try {
    const machine = await machineService.getMachineById(req.params.id);
    if (!machine) return res.status(404).json({ message: "Produit introuvable" });

    // Delete images from disk if present
    if (Array.isArray(machine.images) && machine.images.length > 0) {
      machine.images.forEach((img) => {
        try {
          const imagePath = path.join(process.cwd(), img.replace(/^[\/]/, ""));
          fs.unlink(imagePath, (err) => {
            if (err) console.warn("Impossible de supprimer l'image :", err.message);
          });
        } catch (e) {
          console.warn("Error removing image:", e.message);
        }
      });
    }

    await machineService.deleteMachine(req.params.id);
    res.json({ message: "machine supprimé" });
  } catch (err) {
    next(err);
  }
};



const getBestSellingMachines = async (req, res) => {
  try {
    // Find top 3 machines by sales
    const machines = await Machine.find().sort({ sales: -1 }).limit(3);

    // Map to desired format
    const result = machines.map((machine) => ({
      _id: machine._id,
      name: machine.name,
      type: machine.type,
      description: machine.description,
      coffeeTypeSupported: machine.coffeeTypeSupported,
      price: machine.price,
      stock: machine.stock,
      sales: machine.sales || 0,
      images: (machine.images || []).map(buildImageUrl),
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch best-selling machines" });
  }
};


module.exports = {
  getAllMachines,
  getMachineById,
  createMachine,
  updateMachine,
  deleteMachine,
   getBestSellingMachines,
};
