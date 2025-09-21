import mysql_pool from "../db/mysql_pool.js";
import { LIKE_QUERIES } from "../db/queries/like_queries.js";
import likeSchema from "../schemas/likeSchema.js";
import { createBaseModel } from "./BaseModel.js";

const LikesModel = {
    ...createBaseModel("likes", mysql_pool, likeSchema),

    async deleteLike(author_id, target_id, target_type) {
        await mysql_pool.execute(LIKE_QUERIES.DELETE, [author_id, target_id, target_type]);
    },
};

export default LikesModel;