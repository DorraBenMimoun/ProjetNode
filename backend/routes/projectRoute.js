const express = require("express");
const projectController = require("../controllers/projectController");
const {authMiddleware} = require("../middlewares/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: uuid
 *           example: "60d0fe4f5311236168a109ca"
 *         name:
 *           type: string
 *           example: "Projet de Développement"
 *         description:
 *           type: string
 *           example: "Un projet pour développer une application web"
 *         owner:
 *           type: string
 *           format: uuid
 *           description: "ID de l'utilisateur propriétaire du projet"
 *         members:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: "Liste des membres du projet"
 *         tasks:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: "Liste des tâches associées au projet"
 *         archived:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-10-18T12:00:00.000Z"
 *     CreateProject:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Projet de Développement"
 *         description:
 *           type: string
 *           example: "Un projet pour développer une application web"
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Créer un nouveau projet
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProject'
 *     responses:
 *       201:
 *         description: Projet créé avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/", authMiddleware, projectController.createProject);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Récupérer tous les projets de l'utilisateur
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des projets récupérée avec succès
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/", authMiddleware, projectController.getAllProjectsUser);

/**
 * @swagger
 * /projects/{id}:
 *   get:
 *     summary: Récupérer un projet par ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet à récupérer
 *     responses:
 *       200:
 *         description: Projet trouvé
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/:id", authMiddleware, projectController.getProjectById);

/**
 * @swagger
 * /projects/{id}/addMember:
 *   post:
 *     summary: Ajouter un membre à un projet
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet auquel ajouter un membre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: email de l'utilisateur à ajouter
 *     responses:
 *       200:
 *         description: Membre ajouté avec succès
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/:id/addMember", authMiddleware, projectController.addMember);

/**
 * @swagger
 * /projects/{id}/removeMember:
 *   post:
 *     summary: Supprimer un membre d'un projet
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet dont retirer un membre
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: email de l'utilisateur à supprimer
 *     responses:
 *       200:
 *         description: Membre supprimé avec succès
 *       404:
 *         description: Projet ou membre non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/:id/removeMember", authMiddleware, projectController.removeMember);

/**
 * @swagger
 * /projects/{id}/archive:
 *   post:
 *     summary: Archiver un projet
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet à archiver
 *     responses:
 *       200:
 *         description: Projet archivé avec succès
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/:id/archive", authMiddleware, projectController.archiveProject);

/**
 * @swagger
 * /projects/{id}/unarchive:
 *   post:
 *     summary: Désarchiver un projet
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet à désarchiver
 *     responses:
 *       200:
 *         description: Projet désarchivé avec succès
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/:id/unarchive", authMiddleware, projectController.unarchiveProject);

/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Mettre à jour un projet
 *     description: Modifier le nom et/ou la description d'un projet existant
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateProject"
 *     responses:
 *       200:
 *         description: Projet mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Project"
 *       400:
 *         description: Requête invalide
 *       401:
 *         description: Non autorisé (Token manquant ou invalide)
 *       404:
 *         description: Projet non trouvé
 */
router.put("/:id", authMiddleware, projectController.updateProject);

/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Supprimer un projet
 *     description: Supprime un projet par son ID (seul le propriétaire peut le supprimer).
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet à supprimer
 *     responses:
 *       200:
 *         description: Projet supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Projet supprimé avec succès"
 *       401:
 *         description: Non autorisé (Token manquant ou invalide)
 *       403:
 *         description: Accès interdit (Seul le propriétaire peut supprimer le projet)
 *       404:
 *         description: Projet non trouvé
 */
router.delete("/:id", authMiddleware, projectController.deleteProject);

/**
 * @swagger
 * /projects/count/total:
 *   get:
 *     summary: Obtenir le nombre total de projets
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nombre total de projets récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 42
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/count/total", authMiddleware, projectController.getTotalProjectsCount);

/**
 * @swagger
 * /projects/collaborators/count:
 *   get:
 *     summary: Obtenir le nombre total de collaborateurs de tous les projets
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Nombre total de collaborateurs récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Erreur interne du serveur
 */
router.get("/collaborators/count", authMiddleware, projectController.getTotalCollaboratorsCount);


module.exports = router;
