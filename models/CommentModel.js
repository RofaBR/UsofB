import mysql_pool from "../db/mysql_pool.js";
import CommentsSchema from "../schemas/CommentsSchema.js";
import { createBaseModel } from "./BaseModel.js";

const CommentModel = {
    ...createBaseModel ("comments", mysql_pool, CommentsSchema),

    async findByAuthorId(authorId, page = 1, limit = 20) {
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 20;
        const offset = (pageNum - 1) * limitNum;

        const query = `
            SELECT
                c.id,
                c.author_id,
                c.post_id,
                c.content,
                c.create_at
            FROM comments c
            WHERE c.author_id = ?
            ORDER BY c.create_at DESC
            LIMIT ${limitNum} OFFSET ${offset}
        `;

        const countQuery = `SELECT COUNT(*) as total FROM comments WHERE author_id = ?`;

        const [rows] = await mysql_pool.execute(query, [authorId]);
        const [countResult] = await mysql_pool.execute(countQuery, [authorId]);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limitNum);

        return {
            data: rows,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages,
                hasMore: pageNum < totalPages
            }
        };
    },

    async findPaginatedWithDetails(options = {}) {
        const {
            page = 1,
            limit = 20,
            post_id,
            userId = null
        } = options;

        const postIdNum = parseInt(post_id, 10);
        if (!post_id || isNaN(postIdNum)) {
            throw new Error('post_id is required and must be a valid number');
        }

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 20;
        const offset = (pageNum - 1) * limitNum;

        const query = `
            SELECT
                c.id,
                c.author_id,
                c.post_id,
                c.create_at,
                c.content,
                u.login as author_login,
                u.full_name as author_name,
                u.avatar as author_avatar,
                CAST(COALESCE(SUM(CASE WHEN l.type = 'like' THEN 1 ELSE 0 END), 0) AS SIGNED) AS like_count,
                CAST(COALESCE(SUM(CASE WHEN l.type = 'dislike' THEN 1 ELSE 0 END), 0) AS SIGNED) AS dislike_count,
                CAST((COALESCE(SUM(CASE WHEN l.type = 'like' THEN 1 ELSE 0 END), 0) -
                 COALESCE(SUM(CASE WHEN l.type = 'dislike' THEN 1 ELSE 0 END), 0)) AS SIGNED) AS rating,
                MAX(CASE WHEN l.author_id = ? THEN l.type ELSE NULL END) AS currentUserVote
            FROM comments c
            LEFT JOIN users u ON c.author_id = u.id
            LEFT JOIN likes l ON l.comment_id = c.id
            WHERE c.post_id = ?
            GROUP BY c.id, c.author_id, c.post_id, c.create_at, c.content,
                     u.login, u.full_name, u.avatar
            ORDER BY rating DESC, c.create_at DESC
            LIMIT ${limitNum} OFFSET ${offset}
        `;

        const countQuery = `SELECT COUNT(*) as total FROM comments WHERE post_id = ?`;

        const [rows] = await mysql_pool.execute(query, [userId, postIdNum]);
        const [countResult] = await mysql_pool.execute(countQuery, [postIdNum]);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limitNum);

        return {
            data: rows,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                totalPages,
                hasMore: pageNum < totalPages
            }
        };
    }
};

export default CommentModel