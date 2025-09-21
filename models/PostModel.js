import mysql_pool from "../db/mysql_pool.js";
import { createBaseModel } from "./BaseModel.js";
import PostsSchema from "../schemas/PostsSchema.js";

const PostModel = {
    ...createBaseModel("posts", mysql_pool, PostsSchema),

    async findAllWithIds(ids) {
        if (!ids || ids.length === 0) return [];
        const placeholders = ids.map(() => "?").join(",");
        const query = `SELECT * FROM posts WHERE id IN (${placeholders})`;
        const [rows] = await mysql_pool.execute(query, ids);
        return rows.map(row => PostsSchema.read(row));
    },

     async findWithFilters({ 
        page = 1, 
        limit = 10, 
        orderBy = "publish_date", 
        orderDir = "DESC", 
        categories = [] 
    }) {
        let values = [];
        let joins = [];
        let whereClauses = [];
        let selectColumns = ["p.*"];
        let orderColumn;

        if (["likes", "dislikes", "score"].includes(orderBy)) {
            joins.push(`LEFT JOIN likes l ON l.target_id = p.id AND l.target_type = 'post'`);
            selectColumns.push(`
                SUM(CASE WHEN l.type = 'like' THEN 1 ELSE 0 END) AS like_count,
                SUM(CASE WHEN l.type = 'dislike' THEN 1 ELSE 0 END) AS dislike_count,
                (SUM(CASE WHEN l.type = 'like' THEN 1 ELSE 0 END) - SUM(CASE WHEN l.type = 'dislike' THEN 1 ELSE 0 END)) AS score
            `);

            orderColumn =
                orderBy === "likes" ? "like_count" :
                orderBy === "dislikes" ? "dislike_count" : "score";
        } else {
            orderColumn = `p.${orderBy}`;
        }

        if (categories.length > 0) {
            joins.push(`JOIN post_categories pc ON p.id = pc.post_id`);
            const placeholders = categories.map(() => "?").join(",");
            whereClauses.push(`pc.category_id IN (${placeholders})`);
            values.push(...categories);
        }

        let sql = `
            SELECT ${selectColumns.join(", ")}
            FROM posts p
            ${joins.join(" ")}
            ${whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : ""}
        `;

        if (["likes", "dislikes", "score"].includes(orderBy) || categories.length > 0) {
            sql += " GROUP BY p.id";
        }

        const offset = (page - 1) * limit;
        sql += ` ORDER BY ${orderColumn} ${orderDir} LIMIT ${mysql_pool.escape(limit)} OFFSET ${mysql_pool.escape(offset)}`;

        const [rows] = await mysql_pool.execute(sql, values);

        const data = rows.map(row => PostsSchema.read(row));

        return {
            data,
            pagination: {
                page,
                limit,
                count: data.length,
                hasNextPage: data.length === limit,
            },
        };
    }
}

export default PostModel