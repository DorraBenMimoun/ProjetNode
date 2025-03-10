const express = require("express");
const NotificationController = require("../Controllers/NotificationController");
const notificationRouter = express.Router();
const auth = require("../Middleware/auth");

notificationRouter.get(
  "/test/:userId",
  NotificationController.sendTestNotification
);

notificationRouter.get(
  "/get-notifications/",
  auth,
  NotificationController.getNotifications
);

notificationRouter.post(
  "/mark-all-as-read",
  auth,
  NotificationController.markAllAsRead
);

module.exports = notificationRouter;
