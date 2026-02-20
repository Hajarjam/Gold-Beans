const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const clientSchema = new mongoose.Schema( 
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["client", "admin"], default: "client" },
    isActive: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    activationToken: String 
  },
  { timestamps: true } 
);

clientSchema.pre("save", async function () {
  if (!this.isModified("password")) return ;
  this.password = await bcrypt.hash(this.password, 10);
});


clientSchema.methods.comparePassword = async function (password) { 
  return bcrypt.compare(password, this.password);
};

clientSchema.methods.toJSON = function () { 
  const user = this.toObject();
  delete user.password;
  return user;
};

const Client = mongoose.model("Client", clientSchema);
module.exports = Client;
