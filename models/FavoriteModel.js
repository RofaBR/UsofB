import mysql_pool from "../db/mysql_pool.js";
import FavoriteSchema from "../schemas/FavoriteSchema.js";
import { createBaseModel } from "./BaseModel.js";
import { FAVORITE_QUERIES } from "../db/queries/favorite_queries.js";

const FavoriteModel = {
    ...createBaseModel("favorite", mysql_pool, FavoriteSchema),

    async deleteFavorite(post_id) {
        await mysql_pool.execute(FAVORITE_QUERIES.DELETE_BY_POST_ID, [post_id]);
    }
};

export default FavoriteModel;