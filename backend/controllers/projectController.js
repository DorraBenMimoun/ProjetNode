const Project = require("../models/projectModel");
const Task = require("../models/taskModel");
const User = require("../models/userModel");

// Get all projects for the authenticated user
exports.getAllProjectsUser = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user._id },
                { members: req.user._id }
            ]
        })
            .populate("owner", "name email")
            .populate("members", "name email")
            .populate("tasks", "title description status dateDebut dateTerminee createdBy doneBy archived")
            .exec();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create a new project
exports.createProject = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }

        const newProject = new Project({
            name,
            description,
            owner: req.user._id,
        });

        await newProject.save();

        res.status(201).json({
            message: "Project created successfully.",
            project: newProject,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id })
            .populate("owner", "name email") // Récupère les champs 'name' et 'email' de l'utilisateur
            .populate("members", "name email") // Récupère les champs 'name' et 'email' de l'utilisateur qui a terminé la tâche
            .populate("tasks", "title description status dateDebut dateTerminee createdBy doneBy archived")
            .exec();

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isOwner = project.owner.equals(req.user._id);
        const isMember = project.members.includes(req.user._id);

        if (!isOwner && !isMember) {
            return res.status(403).json({ message: "You are not authorized to add tasks to this project" });
        }

        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Update a project
exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isOwner = project.owner.equals(req.user._id);

        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to add tasks to this project" });
        }

        project.name = req.body.name || project.name;
        project.description = req.body.description || project.description;

        await project.save();

        res.status(200).json({
            message: "Project updated successfully",
            project,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Delete a project
exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        const isOwner = project.owner.equals(req.user._id);

        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to add tasks to this project" });
        }

        await Task.deleteMany({ project: req.params.id });
        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Get all tasks for a project
exports.getAllTasksProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.id });
        
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
//add member to project
exports.addMember = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        const isOwner = project.owner.equals(req.user._id);

        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to add tasks to this project" });
        }

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (project.members.includes(user._id)) {
            return res.status(400).json({ message: "User already added to the project" });
        }

        if (email === req.user.email) {
            return res.status(400).json({ message: "You cannot add yourself to the project" });
        }

        project.members.push(user._id);

        await project.save();

        res.status(200).json({
            message: "User added to the project successfully",
            project,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//remove member from project
exports.removeMember = async (req, res) => {
    try {

        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        const isOwner = project.owner.equals(req.user._id);

        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to add tasks to this project" });
        }

        const { email } = req.body;


        member = await User
            .findOne({ email })
            .select("_id")

        if (!project.members.includes(member._id)) {
            return res.status(400).json({ message: "User not found in the project" });
        }

        project.members = project.members.filter(
            (member) => member.toString() !== member._id.toString()
        );

        await project.save();

        res.status(200).json({
            message: "User removed from the project successfully",
            project,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// archive project
exports.archiveProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isOwner = project.owner.equals(req.user._id);

        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to add tasks to this project" });
        }

        project.archived = true;

        await project.save();

        res.status(200).json({
            message: "Project archived successfully",
            project,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// unarchive project
exports.unarchiveProject = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const isOwner = project.owner.equals(req.user._id);

        if (!isOwner) {
            return res.status(403).json({ message: "You are not authorized to add tasks to this project" });
        }

        project.archived = false;

        await project.save();

        res.status(200).json({
            message: "Project unarchived successfully",
            project,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.getTotalProjectsCount = async (req, res) => {
    try {
        const userId = req.user._id;

        const totalProjects = await Project.countDocuments({
            $or: [
            { owner: userId },
            { members: userId }
            ]
        });

        res.status(200).json({ totalProjects });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

exports.getTotalCollaboratorsCount = async (req, res) => {
    try {
        const userId = req.user._id;

        // Récupérer tous les projets de l'utilisateur
        const projects = await Project.find({ owner: userId }).select("members");
        // Extraire tous les collaborateurs uniques
        const collaboratorsSet = new Set();
        projects.forEach((project) => {
            project.members.forEach((collaboratorId) => collaboratorsSet.add(collaboratorId.toString()));
        });
        res.status(200).json({ totalCollaborators: collaboratorsSet.size });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};



