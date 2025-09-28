import NotificationService from "../services/NotificationService.js";

const notification_controller = {
    get_notifications: async (req, res) => {
        try {
            const userId = req.user.userId;
            const notifications = await NotificationService.getUserNotifications(userId);
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    delete_notification: async (req, res) => {
        try {
            const userId = req.user.userId;
            const postId = parseInt(req.params.post_id);

            await NotificationService.deleteNotification({
                user_id: userId,
                post_id: postId
            });

            res.status(200).json({
                success: true,
                message: "Notification deleted successfully"
            });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    delete_all_notifications: async (req, res) => {
        try {
            const userId = req.user.userId;
            await NotificationService.deleteAllUserNotifications(userId);

            res.status(200).json({
                success: true,
                message: "All notifications deleted successfully"
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default notification_controller;