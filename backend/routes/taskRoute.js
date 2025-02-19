const express = require("express");

const taskController = require("../controllers/taskController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: L'ID unique de la tâche
 *         title:
 *           type: string
 *           description: Le titre de la tâche
 *         description:
 *           type: string
 *           description: La description de la tâche
 *         status:
 *           type: string
 *           enum: [TO_DO, DOING, DONE]
 *           default: TO_DO
 *           description: Le statut actuel de la tâche
 *         dateDebut:
 *           type: string
 *           format: date-time
 *           description: La date de début de la tâche
 *         dateTerminee:
 *           type: string
 *           format: date-time
 *           description: La date à laquelle la tâche a été terminée
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: L'ID de l'utilisateur qui a créé la tâche
 *             name:
 *               type: string
 *               description: Le nom de l'utilisateur
 *             email:
 *               type: string
 *               description: L'email de l'utilisateur
 *         doneBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: L'ID de l'utilisateur qui a terminé la tâche
 *             name:
 *               type: string
 *               description: Le nom de l'utilisateur
 *             email:
 *               type: string
 *               description: L'email de l'utilisateur
 *
 */

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
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
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Tâche créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.post("/", authMiddleware, taskController.createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Récupérer les détails d'une tâche par ID
 *     tags: [Tâches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche à récupérer
 *     responses:
 *       200:
 *         description: Détails de la tâche avec les informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.get("/:id", authMiddleware, taskController.getTaskById);

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
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Tâche mise à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.put("/:id/inProgress", authMiddleware, taskController.setInProgress);

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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.put("/:id/completed", authMiddleware, taskController.setCompleted);

// Archieve task needed

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
