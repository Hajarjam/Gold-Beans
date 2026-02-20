const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    coffee: { type: mongoose.Schema.Types.ObjectId, ref: 'Coffee', required: true },
    plan: {
      type: String,
      enum: ['Bi-Weekly', 'Monthly', 'semesterly'],
      required: true,
    },
    grind: { type: String, required: true },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Active', 'Paused', 'Cancelled'],
      default: 'Active',
    },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    nextDelivery: { type: Date },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);