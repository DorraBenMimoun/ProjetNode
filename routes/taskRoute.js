const express = require("express");

const taskController = require("../controllers/taskController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Récupérer toutes les tâches de l'utilisateur
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des tâches
 */
router.get("/", authMiddleware, taskController.getAllTasksUser);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Créer une nouvelle tâche
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Nouvelle tâche"
 *               description:
 *                 type: string
 *                 example: "Description de la tâche"
 *     responses:
 *       201:
 *         description: Tâche créée
 */
router.post("/", authMiddleware, taskController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Mettre à jour une tâche
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["en cours", "terminé", "annulé"]
 *                 example: "terminé"
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 */
router.put("/:id", authMiddleware, taskController.updateTask);

/**
 * @swagger
 * /tasks/{id}/inProgress:
 *   put:
 *     summary: Mettre une tâche en statut "en cours"
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche à mettre en cours
 *     responses:
 *       200:
 *         description: Tâche mise à jour à "en cours"
 */
router.put("/:id/inPprogress", authMiddleware, taskController.setInProgress);

/**
 * @swagger
 * /tasks/{id}/completed:
 *   put:
 *     summary: Mettre une tâche en statut "terminé"
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche à mettre en statut "terminé"
 *     responses:
 *       200:
 *         description: Tâche mise à jour à "terminé"
 */
router.put("/:id/completed", authMiddleware, taskController.setCompleted);

/**
 * @swagger
 * /tasks/{id}/cancelled:
 *   put:
 *     summary: Mettre une tâche en statut "annulé"
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche à mettre en statut "annulé"
 *     responses:
 *       200:
 *         description: Tâche mise à jour à "annulé"
 */
router.put("/:id/cancelled", authMiddleware, taskController.setCancelled);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Supprimer une tâche
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche à supprimer
 *     responses:
 *       200:
 *         description: Tâche supprimée
 */
router.delete("/:id", authMiddleware, taskController.deleteTask);

module.exports = router;
