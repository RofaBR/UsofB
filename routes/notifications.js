import express from "express";
import notification_controller from "../controllers/notification.js";
import TokenValidator from "../middlewares/tokenMiddleware.js";

const notification_router = express.Router();

notification_router.get("/api/notifications", TokenValidator.validateAccess(), notification_controller.get_notifications);
notification_router.delete("/api/notifications/posts/:post_id", TokenValidator.validateAccess(), notification_controller.delete_notification);
notification_router.delete("/api/notifications", TokenValidator.validateAccess(), notification_controller.delete_all_notifications);

export default notification_router;