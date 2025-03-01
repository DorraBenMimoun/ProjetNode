const express = require("express");
const commentController = require("../controllers/commentController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           example: "60d0fe4f5311236168a109ca"
 *         taskId:
 *           type: string
 *           format: uuid
 *           description: "ID de la tâche associée au commentaire"
 *         userId:
 *           type: string
 *           format: uuid
 *           description: "ID de l'utilisateur qui a écrit le commentaire"
 *         text:
 *           type: string
 *           example: "Ceci est un commentaire."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-10-18T12:00:00.000Z"
 */

/**
 * @swagger
 * /comments/{taskId}:
 *   post:
 *     summary: Ajouter un commentaire à une tâche
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche concernée
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Ceci est un commentaire."
 *     responses:
 *       201:
 *         description: Commentaire ajouté avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/:taskId", authMiddleware, commentController.addComment);

/**
 * @swagger
 * /comments/{taskId}:
 *   get:
 *     summary: Récupérer tous les commentaires d'une tâche
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche concernée
 *     responses:
 *       200:
 *         description: Liste des commentaires récupérée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/:taskId", authMiddleware, commentController.getCommentsByTask);

/**
 * @swagger
 * /comments/{commentId}:
 *   put:
 *     summary: Mettre à jour un commentaire
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: "Mise à jour du commentaire."
 *     responses:
 *       200:
 *         description: Commentaire mis à jour avec succès
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.put("/:commentId", authMiddleware, commentController.updateComment);

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Supprimer un commentaire
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du commentaire à supprimer
 *     responses:
 *       200:
 *         description: Commentaire supprimé avec succès
 *       404:
 *         description: Commentaire non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.delete("/:commentId", authMiddleware, commentController.deleteComment);

module.exports = router;
