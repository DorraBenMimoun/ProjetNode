const Project = require("../models/projectModel");
let projectsLive = [];
let ProjectIo = null;

const ProjectSocket = function (io) {
  ProjectIo = io;

  io.once("connection", (socket) => {
    // Listen for "consult-project" event
    socket.on("consult-project", (data) => {
      console.log(
        `User (${socket.id}) is consulting project: ${data.projectId}`
      );

      // Add the project to the list of projects if not already present
      const existingProjectIndex = projectsLive.findIndex(
        (project) => project.id === data.projectId
      );
      if (existingProjectIndex === -1) {
        projectsLive.push({ id: data.projectId, users: [socket.id] });
      } else {
        // If the project is already in the list, add the user to the project
        if (!projectsLive[existingProjectIndex].users.includes(socket.id))
          projectsLive[existingProjectIndex].users.push(socket.id);
      }

      // Handle disconnect event
      socket.on("disconnect", () => {
        // Remove the user from the project
        projectsLive.forEach((project) => {
          project.users = project.users.filter((user) => user !== socket.id);
          if (project.users.length === 0) {
            // Remove the project from the list if there are no users
            projectsLive = projectsLive.filter(
              (project) => project.id !== data.projectId
            );
          }
        });
      });

      io.to(socket.id).emit(
        "connected-project",
        " Hello " +
          socket.id +
          "You're connected to the project  " +
          data.projectId
      );
    });
  });
};

const updateLiveProject = async (projectId, message, emetter) => {
  try {
    console.log("Updating live project");
    console.log("Project ID: ", projectId);
    // Find the project in the list of projects
    const projectIndex = projectsLive.findIndex(
      (project) => project.id == projectId
    );

    console.log("Project index: ", projectIndex);
    // If the project is in the list, emit the updated project to all users
    if (projectIndex !== -1) {
      // Get the updated Project
      const updatedProject = await Project.findById(projectId).populate({
        path: "tasks",
        populate: {
          path: "doneBy",
          select: "username", // Only get the username field
        },
      });

      // Emit the updated project to all users
      projectsLive[projectIndex].users.forEach((user) => {
        ProjectIo.to(user).emit(
          "update-project",
          updatedProject,
          message,
          emetter
        );
        console.log("Project updated for user: ", user);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = { ProjectSocket, updateLiveProject };
