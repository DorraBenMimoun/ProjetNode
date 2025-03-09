const Task = require("../models/taskModel");
const Project = require("../models/projectModel");
const Comment = require("../models/CommentModel");

exports.getAllTasksUser = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {

    const { title, description,projectId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner.equals(req.user._id);
    const isMember = project.members.includes(req.user._id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: "You are not authorized to add tasks to this project" });
    }

    const newTask = new Task({
      title,
      description,
      project: projectId,
      createdBy: req.user._id,
    });

    await newTask.save();

    //add task to project
    await Project.findByIdAndUpdate
    (projectId, { $push: { tasks: newTask._id } });

    res.status(201).json({
      message: "Task created successfully.",
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    })
      .populate("createdBy", "name email") // Récupère les champs 'name' et 'email' de l'utilisateur
      .populate("doneBy", "name email") // Récupère les champs 'name' et 'email' de l'utilisateur qui a terminé la tâche
      .exec();

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner.equals(req.user._id);
    const isMember = project.members.includes(req.user._id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: "You are not authorized to add tasks to this project" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner.equals(req.user._id);
    const isMember = project.members.includes(req.user._id);

    if (!isOwner && !isMember)
      {
      return res.status(403).json({ message: "You are not authorized to update tasks in this project" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;

    if (req.body.status) {
      task.status = req.body.status;

      if (req.body.status === "DOING") {
      task.dateDebut = Date.now();
      } else if (req.body.status === "DONE") {
      task.dateTerminee = Date.now();
      }
    }

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner.equals(req.user._id);
    const isMember = project.members.includes(req.user._id);

    if (!isOwner && !isMember) {
      return res.status(403).json({ message: "You are not authorized to add tasks to this project" });
    }

    await Comment.deleteMany({ taskId: task._id });
    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.setInProgress = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        status: "DOING",
        updatedAt: Date.now(),
        dateDebut: Date.now(),
        doneBy: req.user._id,
      },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la tâche",
      error: err,
    });
  }
};

exports.setCompleted = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status: "DONE", updatedAt: Date.now(), dateTerminee: Date.now() },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la tâche",
      error: err,
    });
  }
};

exports.archiveTask = async (req, res) => {
  const { id } = req.params;
  try {
    
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { archived: true, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors de l'archivage de la tâche",
      error: err,
    });
  }
};

exports.unarchiveTask = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { archived: false, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({
      message: "Erreur lors du désarchivage de la tâche",
      error: err,
    });
  }
};

exports.getArchivedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.id, archived: true });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getTaskStatusDistribution = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({ owner: userId }).select("_id");
    const projectIds = projects.map((project) => project._id);

    const statusDistribution = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusStats = {
      TO_DO: 0,
      DOING: 0,
      DONE: 0,
    };

    statusDistribution.forEach((entry) => {
      statusStats[entry._id] = entry.count;
    });

    res.status(200).json(statusStats);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
exports.getTasksCreatedLast30Days = async (req, res) => {
  try {
    const userId = req.user._id; 

    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);
    startDate.setHours(0, 0, 0, 0); // Début du premier jour
    today.setHours(23, 59, 59, 999); // Fin du jour actuel


    const projects = await Project.find({ owner: userId }).select("_id");
    const projectIds = projects.map((project) => project._id);

    if (projectIds.length === 0) {
      return res.status(200).json({ message: "Aucun projet trouvé", dailyStats: {} });
    }

    const tasksByDay = await Task.aggregate([
      {
        $match: {
          project: { $in: projectIds },
          createdAt: { $gte: startDate, $lte: today }, // Filtrer par dateDebut
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Trier par date croissante
    ]);


    let dailyStats = {};
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
      dailyStats[dateString] = 0;
    }

    tasksByDay.forEach((task) => {
      dailyStats[task._id] = task.count;
    });

    res.status(200).json(dailyStats);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des statistiques des tâches commencées",
      error: error.message,
    });
  }
};

exports.getAverageCompletionTime = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({ owner: userId }).select("_id");
    const projectIds = projects.map((project) => project._id);

    const avgCompletionTime = await Task.aggregate([
      {
        $match: {
          project: { $in: projectIds },
          status: "DONE",
          dateTerminee: { $exists: true, $ne: null },
        },
      },
      {
        $project: {
          completionTime: {
            $subtract: ["$dateTerminee", "$createdAt"],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: "$completionTime" },
        },
      },
    ]);

    const averageCompletionTime = avgCompletionTime.length
      ? avgCompletionTime[0].avgTime / (1000 * 60 * 60 * 24) // Convertir en jours
      : 0;

    res.status(200).json({ averageCompletionTime: `${averageCompletionTime.toFixed(2)}` });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getTotalTasksCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const projects = await Project.find({ owner: userId }).select("_id");
    const projectIds = projects.map((project) => project._id);

    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });

    res.status(200).json({ totalTasks });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

