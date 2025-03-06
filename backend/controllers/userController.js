const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require('uuid');

require("dotenv").config();

// Configuration du transporteur SMTP Mailtrap
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Helper function to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" } // Token expires in 30 days
  );
};

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "This email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      verificationToken, 

    });

    await newUser.save();

      // Envoyer l'email de vérification
      const verificationLink = `http://localhost:9901/users/verify/${verificationToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification",
        text: `Click the following link to verify your account: ${verificationLink}`,
      };
  
      await transporter.sendMail(mailOptions);

    const token = generateToken(newUser);

    res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Vérification du token pour activer le compte
exports.verifyUser = async (req, res) => {
  try {
    console.log("hellooo")
    console.log("token",req.params)
    const { token } = req.params;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.isVerified = true;
    user.verificationToken = null; // Supprimer le token après vérification
    await user.save();

    res.json({ message: "Account verified successfully. You can now log in." });

  } catch (error) {
    res.status(500).json({ message: "Invalid or expired token", error: error.message });
  }
};
// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
console.log("email",email)
console.log("password",password)
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    console.log("user",user)
    if (user===null) {
      console.log("user",user)
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;
      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

      // Générer un token sécurisé
      const resetToken = uuidv4();
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 3600000; // 1h de validité
      await user.save();

      // Envoyer l'email avec le lien de réinitialisation
      const resetLink = `http://localhost:9091/reset-password/${resetToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Réinitialisation du mot de passe",
        text: `Cliquez ici pour réinitialiser votre mot de passe: ${resetLink}`,
      };
  
      await transporter.sendMail(mailOptions);

      res.json({ message: 'Email envoyé' });
  } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
      const { token } = req.params;
      const { newPassword } = req.body;

      const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

      if (!user) return res.status(400).json({ message: 'Token invalide ou expiré' });

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiration = null;

      await user.save();
      res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Get all users (Protected)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclure le mot de passe des résultats
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Get user profile (Protected)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id,"-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user profile (Protected)
exports.updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
      return res.status(400).json({ message: "This email is already in use" });
      }

      user.email = req.body.email;
      user.isVerified = false;
      const verificationToken = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
      user.verificationToken = verificationToken;

      const verificationLink = `http://localhost:9901/users/verify/${verificationToken}`;
      const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Email Verification",
      text: `Click the following link to verify your account: ${verificationLink}`,
      };

      await transporter.sendMail(mailOptions);
    }

    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    await user.save();

    res.status(201).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user password (Protected)
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    user.password = await bcrypt.hash(req.body.newPassword, 10);

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Delete user account (Protected)
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
