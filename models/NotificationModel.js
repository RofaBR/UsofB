import mysql_pool from "../db/mysql_pool.js";
import { createBaseModel } from "./BaseModel.js";
import { NOTIFICATION_QUERIES } from "../db/queries/notification_queries.js";
import notificationSchema from "../schemas/NotificationSchema.js";

const NotificationModel = {
    ...createBaseModel("notification", mysql_pool, notificationSchema),

    async deleteByUserAndPost({ user_id, post_id }) {
        await mysql_pool.execute(NOTIFICATION_QUERIES.DELETE_BY_USER_AND_POST, [user_id, post_id]);
    },

    async findByUserAndPost(user_id, post_id) {
        const [rows] = await mysql_pool.execute(NOTIFICATION_QUERIES.FIND_BY_USER_AND_POST, [user_id, post_id]);
        return rows[0];
    },

    async findByUserId(user_id) {
        const [rows] = await mysql_pool.execute(NOTIFICATION_QUERIES.FIND_BY_USER_ID, [user_id]);
        return rows;
    },

    async findByPostId(post_id) {
        const [rows] = await mysql_pool.execute(NOTIFICATION_QUERIES.FIND_BY_POST_ID, [post_id]);
        return rows;
    },

    async deleteByUserId(user_id) {
        await mysql_pool.execute(NOTIFICATION_QUERIES.DELETE_BY_USER_ID, [user_id]);
    },

    async deleteByPostId(post_id) {
        await mysql_pool.execute(NOTIFICATION_QUERIES.DELETE_BY_POST_ID, [post_id]);
    },

    async createNotificationsForSubscribers(post_id, author_id) {
        const [result] = await mysql_pool.execute(NOTIFICATION_QUERIES.CREATE_NOTIFICATIONS_FOR_SUBSCRIBERS, [post_id, author_id]);
        return result;
    },

    async getSubscribersForPost(post_id, author_id) {
        const [rows] = await mysql_pool.execute(NOTIFICATION_QUERIES.GET_SUBSCRIBERS_FOR_POST, [post_id, author_id]);
        return rows;
    }
};

export default NotificationModel;