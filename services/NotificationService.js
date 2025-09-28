import NotificationModel from "../models/NotificationModel.js";

const NotificationService = {
    async createNotification(data) {
        return await NotificationModel.create(data);
    },

    async getUserNotifications(user_id) {
        return await NotificationModel.findByUserId(user_id);
    },

    async deleteNotification({ user_id, post_id }) {
        const notification = await NotificationModel.findByUserAndPost(user_id, post_id);
        if (!notification) {
            throw new Error("Notification not found for this user and post.");
        }
        await NotificationModel.deleteByUserAndPost({ user_id, post_id });
    },

    async deleteAllUserNotifications(user_id) {
        await NotificationModel.deleteByUserId(user_id);
    },

    async deleteAllPostNotifications(post_id) {
        await NotificationModel.deleteByPostId(post_id);
    },

    async notifySubscribersOfPostUpdate(post_id, author_id) {
        try {
            const result = await NotificationModel.createNotificationsForSubscribers(post_id, author_id);
            return {
                success: true,
                notificationsCreated: result.affectedRows,
                message: `Created ${result.affectedRows} notifications for post update`
            };
        } catch (error) {
            throw new Error(`Failed to create notifications: ${error.message}`);
        }
    },

    async getSubscribersForPost(post_id, author_id) {
        return await NotificationModel.getSubscribersForPost(post_id, author_id);
    }
};

export default NotificationService;