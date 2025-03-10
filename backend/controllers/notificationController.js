const Notification = require("../models/notificationModel");
const { getConnectedSocketByUserId } = require("../Sockets/UserSockets");
const { io } = require("../index");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({ userId });
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    await Notification.updateMany({ userId }, { seen: true });
    return res
      .status(200)
      .json({ message: "All notifications marked as read" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const sendNotification = async (userId, message) => {
  try {
    const notification = new Notification({ userId, message });
    await notification.save();

    // Send notification to user
    const connectedSocket = getConnectedSocketByUserId(userId);

    console.log("Sending notification to user:", userId);

    if (connectedSocket) {
      io.to(connectedSocket.socketId).emit("new-notification", notification);
      console.log("User is connected and notification sent");
    } else console.log("User is not connected");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const sendTestNotification = async (req, res) => {
  try {
    const { userId } = req.params;

    const message = "This is a test notification";
    await sendNotification(userId, message);
    return res.status(200).json({ message: "Notification sent" });
  } catch (error) {
    console.error("Error sending test notification:", error);
  }
};

module.exports = {
  getNotifications,
  markAllAsRead,
  sendNotification,
  sendTestNotification,
};
