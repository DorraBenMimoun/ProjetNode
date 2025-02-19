const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false, // Par défaut, l'utilisateur n'est pas vérifié
  },
  verificationToken: {
    type: String, // Stocke le token de vérification
  },
  resetToken: {
    type: String, // Stocke le token de réinitialisation
    default: null, // Par défaut, il n'y a pas de token de réinitialisation
  },
  resetTokenExpiration: {
    type: Date, // Stocke la date d'expiration du token de réinitialisation
    default: null, // Par défaut, il n'y a pas de date d'expiration
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
