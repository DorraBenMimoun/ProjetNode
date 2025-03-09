const Comment = require("../models/CommentModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");
const Project = require("../models/projectModel");

// Ajouter un commentaire à une tâche
exports.addComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Le commentaire ne peut pas être vide" });
        }

        // Vérifier si la tâche existe
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }

        // Vérifier si l'utilisateur est le propriétaire ou membre du projet
        const project = await Project.findById(task.project);
        const isOwner = project.owner.equals(req.user._id);
        const isMember = project.members.includes(req.user._id);
    
        if (!isOwner && !isMember) {
          return res.status(403).json({ message: "You are not authorized to add tasks to this project" });
        }

        const newComment = new Comment({
            taskId,
            userId: req.user._id,
            text
        });

        await newComment.save();
        await newComment.populate("userId", "name email");
        res.status(201).json({ message: "Commentaire ajouté avec succès", comment: newComment });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// Récupérer tous les commentaires d'une tâche
exports.getCommentsByTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const comments = await Comment.find({ taskId })
            .populate("userId", "name email") // Récupérer le nom et l'email de l'utilisateur
            .populate("taskId", "title description") // Récupérer le titre et la description de la tâche
            .sort({ createdAt: -1 });

        if (!comments.length) {
            return res.status(404).json({ message: "Aucun commentaire trouvé pour cette tâche" });
        }

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};


// Mettre à jour un commentaire
exports.updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }

        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Non autorisé à modifier ce commentaire" });
        }

        comment.text = text;
        await comment.save();
        await comment.populate("userId", "name email");
        res.status(200).json({ message: "Commentaire mis à jour avec succès", comment });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// Supprimer un commentaire
exports.deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }

        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Non autorisé à supprimer ce commentaire" });
        }

        await comment.deleteOne();
        res.status(200).json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};
