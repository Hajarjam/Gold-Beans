const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productType: { type: String, enum: ["coffee", "machine", "subscription"], required: true },
    productId: { type: String, required: true },
    name: String,
    price: Number,
    quantity: Number,
    buyOption: String, // subscribe | oneTime
    deliveryEvery: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    items: [orderItemSchema],
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, default: 0 },

    shippingAddress: {
      street: String,
      city: String,
      zip: String,
      country: String,
      phone: String,
    },

    payment: {
      method: { type: String, default: "FAKE_CARD" },
      status: { type: String, default: "PAID_FAKE" }, // ou CONFIRMED
      last4: String,
      cardType: String,
    },

    status: { type: String, default: "CONFIRMED" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
