const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },//ref: "User" → relation avec la collection users //required: true → un client DOIT être lié à un utilisateur
    addresses: [
      {
        street: String,
        city: String,
        zip: String,
        country: String,
      }
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
