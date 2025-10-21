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
        categories = [],
        favoriteOnly = false,
        userId = null,
        status = "active",
        role = "user",
        authorId = null,
        search = ''
    }) {
        const queryBuilder = this._buildPostQuery({
            orderBy,
            orderDir,
            categories,
            favoriteOnly,
            userId,
            status,
            role,
            authorId,
            page,
            limit,
            search
        });

        const countQuery = this._buildPostCountQuery({
            categories,
            favoriteOnly,
            userId,
            status,
            role,
            authorId,
            search
        });

        const [[{ total }]] = await mysql_pool.execute(countQuery.sql, countQuery.values);
        const [rows] = await mysql_pool.execute(queryBuilder.sql, queryBuilder.values);
        const data = rows.map(row => PostsSchema.read(row));

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                count: data.length,
                hasNextPage: data.length === limit,
            },
        };
    },

    async getMyPosts({ page = 1, limit = 10, orderBy = "publish_date", orderDir = "DESC", userId }) {
        return this.findWithFilters({
            page,
            limit,
            orderBy,
            orderDir,
            authorId: userId,
            role: "user",
            status: null,
        });
    },

    _buildPostQuery({
        orderBy,
        orderDir,
        categories = [],
        favoriteOnly = false,
        userId = null,
        status = null,
        role = "user",
        authorId = null,
        page = 1,
        limit = 10,
        search = ''
    }) {
        let values = [];
        let joins = [];
        let whereClauses = [];
        let selectColumns = ["p.*"];
        let needsGroupBy = false;

        if (role !== "admin" && role !== "owner") {
            whereClauses.push("p.ban_status = 0");
        }

        if (status) {
            whereClauses.push("p.status = ?");
            values.push(status);
        }

        if (authorId) {
            whereClauses.push("p.author_id = ?");
            values.push(authorId);
        }

        if (search) {
            whereClauses.push("(p.title LIKE ? OR p.content LIKE ?)");
            values.push(`%${search}%`, `%${search}%`);
        }

        if (this._isLikeBasedOrdering(orderBy)) {
            joins.push(`LEFT JOIN likes l ON l.post_id = p.id`);
            selectColumns.push(`
                SUM(CASE WHEN l.type = 'like' THEN 1 ELSE 0 END) AS like_count,
                SUM(CASE WHEN l.type = 'dislike' THEN 1 ELSE 0 END) AS dislike_count,
                (SUM(CASE WHEN l.type = 'like' THEN 1 ELSE 0 END) - SUM(CASE WHEN l.type = 'dislike' THEN 1 ELSE 0 END)) AS score
            `);
            needsGroupBy = true;
        }

        if (categories.length > 0) {
            joins.push(`JOIN post_categories pc ON p.id = pc.post_id`);
            const placeholders = categories.map(() => "?").join(",");
            whereClauses.push(`pc.category_id IN (${placeholders})`);
            values.push(...categories);
            needsGroupBy = true;
        }

        if (favoriteOnly && userId) {
            joins.push(`JOIN favorite f ON f.post_id = p.id`);
            whereClauses.push(`f.user_id = ?`);
            values.push(userId);
            needsGroupBy = true;
        }

        let sql = `
            SELECT ${selectColumns.join(", ")}
            FROM posts p
            ${joins.join(" ")}
            ${whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : ""}
        `;

        if (needsGroupBy) {
            sql += " GROUP BY p.id";
        }

        const orderColumn = this._getOrderColumn(orderBy);
        const offset = (page - 1) * limit;
        sql += ` ORDER BY ${orderColumn} ${orderDir} LIMIT ${mysql_pool.escape(limit)} OFFSET ${mysql_pool.escape(offset)}`;

        return { sql, values };
    },

    _isLikeBasedOrdering(orderBy) {
        return ["likes", "dislikes", "score"].includes(orderBy);
    },

    _getOrderColumn(orderBy) {
        if (orderBy === "likes") return "like_count";
        if (orderBy === "dislikes") return "dislike_count";
        if (orderBy === "score") return "score";
        if (orderBy === "status") return "p.status";
        return `p.${orderBy}`;
    },

    _buildPostCountQuery({
        categories = [],
        favoriteOnly = false,
        userId = null,
        status = null,
        role = "user",
        authorId = null,
        search = ''
    }) {
        let values = [];
        let joins = [];
        let whereClauses = [];
        let needsDistinct = false;

        if (role !== "admin" && role !== "owner") {
            whereClauses.push("p.ban_status = 0");
        }

        if (status) {
            whereClauses.push("p.status = ?");
            values.push(status);
        }

        if (authorId) {
            whereClauses.push("p.author_id = ?");
            values.push(authorId);
        }

        if (search) {
            whereClauses.push("(p.title LIKE ? OR p.content LIKE ?)");
            values.push(`%${search}%`, `%${search}%`);
        }

        if (categories.length > 0) {
            joins.push(`JOIN post_categories pc ON p.id = pc.post_id`);
            const placeholders = categories.map(() => "?").join(",");
            whereClauses.push(`pc.category_id IN (${placeholders})`);
            values.push(...categories);
            needsDistinct = true;
        }

        if (favoriteOnly && userId) {
            joins.push(`JOIN favorite f ON f.post_id = p.id`);
            whereClauses.push(`f.user_id = ?`);
            values.push(userId);
            needsDistinct = true;
        }

        const countSelect = needsDistinct ? "COUNT(DISTINCT p.id)" : "COUNT(*)";

        let sql = `
            SELECT ${countSelect} as total
            FROM posts p
            ${joins.join(" ")}
            ${whereClauses.length ? "WHERE " + whereClauses.join(" AND ") : ""}
        `;

        return { sql, values };
    },

    async calculateRating(postId) {
        const [likes] = await mysql_pool.execute(
            `SELECT
                SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS like_count,
                SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) AS dislike_count
             FROM likes
             WHERE post_id = ? AND comment_id IS NULL`,
            [postId]
        );

        const likeCount = likes[0]?.like_count || 0;
        const dislikeCount = likes[0]?.dislike_count || 0;
        return likeCount - dislikeCount;
    },

    async calculateRatingsForPosts(postIds) {
        if (!postIds || postIds.length === 0) return {};

        const placeholders = postIds.map(() => "?").join(",");
        const [results] = await mysql_pool.execute(
            `SELECT
                post_id,
                SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS like_count,
                SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) AS dislike_count
             FROM likes
             WHERE post_id IN (${placeholders}) AND comment_id IS NULL
             GROUP BY post_id`,
            postIds
        );

        const ratingsMap = {};
        results.forEach(row => {
            const likeCount = row.like_count || 0;
            const dislikeCount = row.dislike_count || 0;
            ratingsMap[row.post_id] = likeCount - dislikeCount;
        });

        return ratingsMap;
    }
};

export default PostModel;