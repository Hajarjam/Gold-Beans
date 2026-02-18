const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["espresso", "filter", "bean-to-cup", "manual"],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    coffeeTypeSupported: {
      type: [String],
      enum: ["beans", "ground"],
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
    },

    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Machine", machineSchema);
