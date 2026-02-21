const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema( //On définit la structure d’un document User dans MongoDB.
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["client", "admin"], default: "client" },
    isActive: { type: Boolean, default: false },//pour savoir si le compte utilisateur est activé ou non.
    resetPasswordToken: String,//À réinitialiser le mot de passe quand l’utilisateur l’oublie. // Mot de passe oublié  --> Générer un token de réinitialisation, l’envoyer par email, puis vérifier ce token lors de la réinitialisation du mot de passe.
    resetPasswordExpires: Date, //À donner une durée de validité au lien de réinitialisation.
    activationToken: String, // C’est un code secret envoyé par email pour activer le compte.
  },
  { timestamps: true } //MongoDB ajoute automatiquement createdAt et updatedAt à chaque document pour suivre quand il a été créé et modifié.
);

userSchema.pre("save", async function () {//Avant chaque sauvegarde (save()), cette fonction s’exécute.
  if (!this.isModified("password")) return ;//Si le mot de passe n’a pas changé → on continue sans le re-hasher
  this.password = await bcrypt.hash(this.password, 10);
});





userSchema.methods.comparePassword = async function (password) { //Cette méthode compare un mot de passe en clair avec le mot de passe haché stocké dans la base de données.
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;