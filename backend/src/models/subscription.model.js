const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    coffee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coffee",
      required: true,
    },

    plan: {
      type: String,
      enum: ["Bi-Weekly", "Monthly", "semesterly"],
      required: true,
    },

    grind: {
      type: String,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Paused", "Cancelled"],
      default: "Active",
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: Date,

    nextDelivery: Date,

    notes: {
      type: String,
      default: "",
    },

    // ✅ moved inside schema fields
    isActive: {
      type: Boolean,
      default: true,
    },

    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    // ✅ only one options object
    timestamps: true,
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);