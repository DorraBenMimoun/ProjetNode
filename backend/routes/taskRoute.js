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
 *           example: "60d0fe4f5311236168a109cb"
 *         title:
 *           type: string
 *           description: Le titre de la tâche
 *           example: "Développer l'authentification"
 *         description:
 *           type: string
 *           description: La description de la tâche
 *           example: "Créer une authentification avec JWT pour les utilisateurs"
 *         status:
 *           type: string
 *           enum: [TO_DO, DOING, DONE]
 *           default: TO_DO
 *           description: Le statut actuel de la tâche
 *         dateDebut:
 *           type: string
 *           format: date-time
 *           description: La date de début de la tâche
 *           example: "2024-02-15T08:00:00.000Z"
 *         dateTerminee:
 *           type: string
 *           format: date-time
 *           description: La date à laquelle la tâche a été terminée
 *           example: "2024-02-20T16:30:00.000Z"
 *         createdBy:
 *           type: string
 *           format: uuid
 *           description: ID de l'utilisateur qui a créé la tâche
 *           example: "60d0fe4f5311236168a109cd"
 *         doneBy:
 *           type: string
 *           format: uuid
 *           description: ID de l'utilisateur qui a terminé la tâche
 *           example: "60d0fe4f5311236168a109ce"
 *         archived:
 *           type: boolean
 *           description: Indique si la tâche est archivée
 *           example: false
 *         project:
 *           type: string
 *           format: uuid
 *           description: ID du projet auquel appartient la tâche
 *           example: "60d0fe4f5311236168a109cf"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création de la tâche
 *           example: "2024-02-14T12:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Dernière mise à jour de la tâche
 *           example: "2024-02-15T09:45:00.000Z"
 *     CreateTask:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - projectId
 *       properties:
 *         title:
 *           type: string
 *           description: Le titre de la tâche
 *           example: "Implémenter le système de notifications"
 *         description:
 *           type: string
 *           description: La description de la tâche
 *           example: "Ajouter un système de notifications en temps réel pour les mises à jour de projet"
 *         projectId:
 *           type: string
 *           format: uuid
 *           description: L'ID du projet auquel la tâche appartient
 *           
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Récupérer toutes les tâches de l'utilisateur
 *     tags: [Tasks]
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
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTask'
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
 *     tags: [Tasks]
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
 *     tags: [Tasks]
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
 *     tags: [Tasks]
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
 *     tags: [Tasks]
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
 *     tags: [Tasks]
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


/**
 * @swagger
 * /tasks/{id}/archive:
 *   post:
 *     summary: Archiver une tâche
 *     description: Marque une tâche comme archivée.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche à archiver
 *     responses:
 *       200:
 *         description: Tâche archivée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post("/:id/archive", authMiddleware, taskController.archiveTask);

/**
 * @swagger
 * /tasks/{id}/unarchive:
 *   post:
 *     summary: Désarchiver une tâche
 *     description: Marque une tâche comme non archivée.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tâche à désarchiver
 *     responses:
 *       200:
 *         description: Tâche désarchivée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Tâche non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.post("/:id/unarchive", authMiddleware, taskController.unarchiveTask);

/**
 * @swagger
 * /tasks/archived/{id}:
 *   get:
 *     summary: Récupérer toutes les tâches archivées d'un projet
 *     description: Renvoie la liste des tâches archivées associées à un projet spécifique.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet dont on veut récupérer les tâches archivées
 *     responses:
 *       200:
 *         description: Liste des tâches archivées du projet
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       500:
 *         description: Erreur serveur
 */
router.get("/archived/:id", authMiddleware, taskController.getArchivedTasks);


module.exports = router;
