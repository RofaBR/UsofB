import mysql_pool from "../db/mysql_pool.js";
import CommentsSchema from "../schemas/CommentsSchema.js";
import { createBaseModel } from "./BaseModel.js";

const CommentModel = {
    ...createBaseModel ("comments", mysql_pool, CommentsSchema),

};

export default CommentModel