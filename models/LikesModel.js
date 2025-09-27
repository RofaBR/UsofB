import mysql_pool from "../db/mysql_pool.js";
import { LIKE_QUERIES } from "../db/queries/like_queries.js";
import likeSchema from "../schemas/likeSchema.js";
import { createBaseModel } from "./BaseModel.js";

const LikesModel = {
    ...createBaseModel("likes", mysql_pool, likeSchema),

    async deleteLike(author_id, post_id = null, comment_id = null) {
        if (post_id) {
            await mysql_pool.execute(LIKE_QUERIES.DELETE_BY_POST, [author_id, post_id]);
        } else if (comment_id) {
            await mysql_pool.execute(LIKE_QUERIES.DELETE_BY_COMMENT, [author_id, comment_id]);
        } else {
            throw new Error("Either post_id or comment_id must be provided.");
        }
    },
};

export default LikesModel;