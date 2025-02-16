const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true,
 },
 status: { 
    type: String, 
    enum: ["à faire", "en cours", "terminé", "annulé"], 
    default: "à faire" 
  },
  dateDebut: { 
    type: Date, 
    required:false
 },
  dateTerminee: { 
    type: Date, 
    required:false

 },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
},
doneBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: false 
},
}, 
{ timestamps: true }); // Active `createdAt` et `updatedAt` automatiquement

// Middleware pour mettre à jour `updatedAt` à chaque modification
TaskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
