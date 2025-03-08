const Task = require("../models/taskModel");
const Project = require("../models/projectModel");

// Get all tasks for the authenticated user
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
    console.log("hello");
    
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description,projectId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
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

// Get a single task by ID
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

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;

    await task.save();

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mettre à jour le statut de la tâche à "en cours"
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

// Mettre à jour le statut de la tâche à "terminé"
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

// Archive task
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

// Unarchive task
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

//Get archived tasks by project
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

    // Récupérer tous les projets de l'utilisateur
    const projects = await Project.find({ owner: userId }).select("_id");
    const projectIds = projects.map((project) => project._id);

    // Répartition par statut
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
    const userId = req.user._id; // Récupération de l'utilisateur connecté
console.log(userId);
    // Définir la période (des 30 derniers jours jusqu'à aujourd'hui)
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 30);
    startDate.setHours(0, 0, 0, 0); // Début du premier jour
    today.setHours(23, 59, 59, 999); // Fin du jour actuel

    console.log("Intervalle de recherche:", startDate, today);

    // Récupérer tous les projets de l'utilisateur
    const projects = await Project.find({ owner: userId }).select("_id");
    console.log("Projets trouvés:", projects);
    const projectIds = projects.map((project) => project._id);

    // Vérifier que l'utilisateur a bien des projets
    if (projectIds.length === 0) {
      return res.status(200).json({ message: "Aucun projet trouvé", dailyStats: {} });
    }

    // Récupérer les tâches qui ont commencé dans les 30 derniers jours
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

    console.log("Tâches trouvées par jour:", tasksByDay);

    // Construire un objet avec les 30 derniers jours, initialisés à 0
    let dailyStats = {};
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateString = currentDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
      dailyStats[dateString] = 0;
    }

    // Mettre à jour les jours où des tâches ont été créées
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

    // Récupérer tous les projets de l'utilisateur
    const projects = await Project.find({ owner: userId }).select("_id");
    const projectIds = projects.map((project) => project._id);

    // Calculer le temps moyen pour terminer une tâche
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
      ? avgCompletionTime[0].avgTime / (1000 * 60 * 60) // Convertir en heures
      : 0;

    res.status(200).json({ averageCompletionTime: `${averageCompletionTime.toFixed(2)} heures` });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

exports.getTotalTasksCount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Récupérer tous les projets de l'utilisateur
    const projects = await Project.find({ owner: userId }).select("_id");
    const projectIds = projects.map((project) => project._id);

    // Compter toutes les tâches associées aux projets de l'utilisateur
    const totalTasks = await Task.countDocuments({ project: { $in: projectIds } });

    res.status(200).json({ totalTasks });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

