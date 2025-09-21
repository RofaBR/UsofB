import mysql_pool from "../db/mysql_pool.js";
import PostCategoriesSchema from "../schemas/PostCategoriesSchema.js"
import { createBaseModel } from "./BaseModel.js";
import { POST_CATEGORIES_QUERIES } from "../db/queries/postCategories_queries.js"
const PostCategoriesModel = {
    // ...createBaseModel("post_categories", mysql_pool, PostCategoriesSchema),

    async create(post_id, category_id) {
        await mysql_pool.execute(POST_CATEGORIES_QUERIES.CREATE, [post_id, category_id]);
    },

    async findByPostId(post_id) {
        const [rows] = await mysql_pool.execute(POST_CATEGORIES_QUERIES.FIND_BY_POST_ID, [post_id]);
        return rows;
    },

    async findByCategoryId(category_id) {
        const [rows] = await mysql_pool.execute(POST_CATEGORIES_QUERIES.FIND_BY_CATEGORY_ID, [category_id]);
        return rows;
    },

    async findByPostID(post_id) {
        const [rows] = await mysql_pool.execute(POST_CATEGORIES_QUERIES.FIND_BY_POST_ID, [post_id]);
        return rows;
    },

    async deleteByPostId(post_id) {
        await mysql_pool.execute(POST_CATEGORIES_QUERIES.DELETE_BY_POST_ID, [post_id]);
    }
}

export default PostCategoriesModel