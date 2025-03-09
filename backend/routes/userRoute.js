const express = require("express");
const userController = require("../controllers/userController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API pour la gestion des utilisateurs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Nom d'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email de l'utilisateur
 *         password:
 *          type: string
 *          format: password
 *          description: Mot de passe sécurisé
 *         isVerified:
 *           type: boolean
 *           description: Statut de vérification de l'utilisateur
 *       example:
 *         username: "john_doe"
 *         email: "john@example.com"
 *         password: "StrongPassword123"
 *         isVerified: true
 *
 *     UserRegister:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Nom d'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email de l'utilisateur
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe sécurisé
 *       example:
 *         username: "john_doe"
 *         email: "john@example.com"
 *         password: "StrongPassword123"
 *
 *     UserLogin:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email de l'utilisateur
 *         password:
 *           type: string
 *           format: password
 *           description: Mot de passe sécurisé
 *       example:
 *         email: "john@example.com"
 *         password: "StrongPassword123"
 * 
 *     UserUpdate:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: Nom d'utilisateur
 *         email:
 *           type: string
 *           format: email
 *           description: Adresse email de l'utilisateur
 *       example:
 *         username: "john_doe"
 *         email: "john@example.com"
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Données invalides ou utilisateur existant
 *       500:
 *         description: Erreur serveur
 */
router.post("/register", userController.registerUser);

/**
 * @swagger
 * /users/verify/{token}:
 *   get:
 *     summary: Vérifie un utilisateur avec un token
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès - Le compte est activé.
 *       400:
 *         description: Token invalide ou expiré.
 *       500:
 *         description: Erreur serveur.
 */
router.get("/verify/:token", userController.verifyUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       401:
 *         description: Identifiants invalides
 *       500:
 *         description: Erreur serveur
 */
router.post("/login", userController.loginUser);


/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Demande de réinitialisation de mot de passe
 *     description: Envoie un email contenant un lien pour réinitialiser le mot de passe.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Email envoyé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/forgot-password', userController.forgotPassword);

/**
 * @swagger
 * /users/reset-password/{token}:
 *   post:
 *     summary: Réinitialisation du mot de passe
 *     description: Permet à un utilisateur de définir un nouveau mot de passe en utilisant un token.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de réinitialisation envoyé par email
 *         schema:
 *           type: string
 *           example: "123456abcdef"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: "newSecurePassword123"
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       400:
 *         description: Token invalide ou expiré
 *       500:
 *         description: Erreur serveur
 */
router.post('/reset-password/:token', userController.resetPassword);





/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get("/", userController.getAllUsers);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Récupérer le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.get("/profile", authMiddleware, userController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Mettre à jour le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Profil utilisateur mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.put("/profile", authMiddleware, userController.updateProfile);


/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Mettre à jour le mot de passe de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: "currentPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newSecurePassword123"
 *     responses:
 *       200:
 *         description: Mot de passe mis à jour avec succès
 *       400:
 *         description: Données invalides ou mot de passe actuel incorrect
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.put("/password", authMiddleware, userController.updatePassword);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Supprimer le compte de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compte utilisateur supprimé avec succès
 *       401:
 *         description: Non autorisé, token manquant ou invalide
 *       500:
 *         description: Erreur serveur
 */
router.delete("/", authMiddleware, userController.deleteAccount);


module.exports = router;
