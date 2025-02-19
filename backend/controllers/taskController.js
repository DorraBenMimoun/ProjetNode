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
