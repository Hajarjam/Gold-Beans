const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: true, // active by default
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
