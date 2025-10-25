import mysql_pool from "../db/mysql_pool.js";
import FavoriteSchema from "../schemas/FavoriteSchema.js";
import { createBaseModel } from "./BaseModel.js";
import { FAVORITE_QUERIES } from "../db/queries/favorite_queries.js";

const FavoriteModel = {
    ...createBaseModel("favorite", mysql_pool, FavoriteSchema),

    async deleteFavorite({ user_id, post_id }) {
        await mysql_pool.execute(FAVORITE_QUERIES.DELETE_BY_USER_AND_POST, [user_id, post_id]);
    },

    async findByUserAndPost(user_id, post_id) {
        const [rows] = await mysql_pool.execute(FAVORITE_QUERIES.FIND_BY_USER_AND_POST, [user_id, post_id]);
        return rows[0];
    },

    async findByUserWithPosts(user_id) {
        const [rows] = await mysql_pool.execute(FAVORITE_QUERIES.FIND_BY_USER_WITH_POSTS, [user_id]);
        return rows;
    }
};

export default FavoriteModel;