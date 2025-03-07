const { request } = require("express");
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    checklist:[
      {
        title: { 
          type:String,
          required : true
        },
        done :{
          type: Boolean,
          default: false
        }
      }
    ],
    status: {
      type: String,
      enum: ["TO_DO", "DOING", "DONE"],
      default: "TO_DO",
    },
    dateDebut: {
      type: Date,
      required: false,
    },
    dateTerminee: {
      type: Date,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doneBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    }
  },
  { timestamps: true }
); // Active `createdAt` et `updatedAt` automatiquement

// Middleware pour mettre à jour `updatedAt` à chaque modification
TaskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
