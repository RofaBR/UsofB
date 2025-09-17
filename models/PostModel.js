import mysql_pool from "../db/mysql_pool";
import { createBaseModel } from "./BaseModel.js";
import PostsSchema from "../schemas/PostsSchema.js";

const PostModel = {
    ...createBaseModel("posts", mysql_pool, PostsSchema),
}

export default PostModel