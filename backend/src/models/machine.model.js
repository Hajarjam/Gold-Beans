const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["espresso", "filter", "capsule", "bean-to-cup", "manual"],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    coffeeTypeSupported: {
      type: [String],
      enum: ["beans", "ground"],
      default: ["beans"],
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
    },

    
    sales: { type: Number, default: 0 },

    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Machine", machineSchema);
