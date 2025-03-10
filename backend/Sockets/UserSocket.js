let connectedUsers = [];

const UserSockets = function (io) {
  io.once("connection", (socket) => {
    // Check if the user is already connected
    if (connectedUsers.some((user) => user.socketId === socket.id)) {
      return;
    }

    const userId = socket.handshake.query.userId;

    if (!userId) {
      console.log("User without userId tried to connect");
      return;
    }

    console.log("New user connected:", userId);

    addUser(socket.id, userId);
    io.to(socket.id).emit("welcome", "Welcome " + userId);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      removeUser(socket.id);
    });
  });
};

const addUser = (socketId, userId) => {
  if (!connectedUsers.some((user) => user.socketId === socketId)) {
    connectedUsers.push({ socketId, userId });
  }
};

const removeUser = (socketId) => {
  connectedUsers = connectedUsers.filter((user) => user.socketId !== socketId);
};

const getConnectedUsers = () => {
  return connectedUsers;
};

const getConnectedSocketByUserId = (userId) => {
  return connectedUsers.find((user) => user.userId == userId);
};

module.exports = {
  getConnectedUsers,
  getConnectedSocketByUserId,
  UserSockets,
};
