import { USER_QUERIES } from "../db/queries/user_queries.js";
import mysql_pool from "../db/mysql_pool.js";
import { createBaseModel } from "./BaseModel.js";
import UserSchema from "../schemas/UserSchema.js";

const UserModel = {
    ...createBaseModel("users", mysql_pool, UserSchema),

    async findbyLogin(login) {
        const [rows] = await mysql_pool.execute(USER_QUERIES.FIND_BY_LOGIN, [login]);
        return rows[0] || null;
    },

    async calculateUserRating(userId) {
        const [rows] = await mysql_pool.execute(USER_QUERIES.CALCULATE_USER_RATING, [userId, userId]);
        return rows[0]?.total_rating || 0;
    },

    async updateRating(userId, rating) {
        await mysql_pool.execute(USER_QUERIES.UPDATE_RATING, [rating, userId]);
        return true;
    },

    async getUserStatistics(userId) {
        const [rows] = await mysql_pool.execute(USER_QUERIES.GET_USER_STATISTICS, [userId, userId, userId]);
        return rows[0] || { posts_count: 0, comments_count: 0, rating: 0 };
    },
};

export default UserModel;
