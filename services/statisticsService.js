import mysql_pool from "../db/mysql_pool.js";
import PostsSchema from "../schemas/PostsSchema.js";
import UserModel from "../models/UserModel.js";
import CategoriesModel from "../models/CategoriesModel.js";

const StatisticsService = {
    async getTopRatedPosts() {
        const query = `
            SELECT
                p.*,
                SUM(CASE WHEN l.type = 'like' THEN 1 ELSE 0 END) AS like_count,
                SUM(CASE WHEN l.type = 'dislike' THEN 1 ELSE 0 END) AS dislike_count,
                (SUM(CASE WHEN l.type = 'like' THEN 1 ELSE 0 END) -
                 SUM(CASE WHEN l.type = 'dislike' THEN 1 ELSE 0 END)) AS rating
            FROM posts p
            LEFT JOIN likes l ON l.post_id = p.id AND l.comment_id IS NULL
            WHERE p.ban_status = 0 AND p.status = 'active'
            GROUP BY p.id
            ORDER BY rating DESC, p.publish_date DESC
            LIMIT 5
        `;

        const [rows] = await mysql_pool.execute(query);
        const enrichedPosts = await Promise.all(
            rows.map(async (row) => {
                const post = PostsSchema.read(row);
                const author = await UserModel.findById(post.author_id);

                return {
                    id: post.id,
                    title: post.title,
                    rating: parseInt(row.rating) || 0,
                    author_name: author?.full_name || 'Unknown',
                    publish_date: post.publish_date,
                    views: post.views || 0
                };
            })
        );

        return enrichedPosts;
    },

    async getTopRatedUsers() {
        const query = `
            SELECT
                id,
                full_name,
                avatar,
                rating
            FROM users
            ORDER BY rating DESC
            LIMIT 5
        `;

        const [rows] = await mysql_pool.execute(query);

        return rows.map(row => ({
            id: row.id,
            full_name: row.full_name,
            avatar: row.avatar,
            rating: row.rating
        }));
    },

    async getTrendingCategories() {
        const query = `
            SELECT
                c.id,
                c.title,
                c.description,
                COUNT(pc.post_id) AS post_count
            FROM categories c
            LEFT JOIN post_categories pc ON c.id = pc.category_id
            LEFT JOIN posts p ON pc.post_id = p.id
            WHERE p.ban_status = 0 AND p.status = 'active'
            GROUP BY c.id
            ORDER BY post_count DESC
            LIMIT 5
        `;

        const [rows] = await mysql_pool.execute(query);

        return rows.map(row => ({
            id: row.id,
            title: row.title,
            description: row.description,
            post_count: parseInt(row.post_count) || 0
        }));
    },

    async getAllStatistics() {
        const [topPosts, topUsers, trendingCategories] = await Promise.all([
            this.getTopRatedPosts(),
            this.getTopRatedUsers(),
            this.getTrendingCategories()
        ]);

        return {
            topPosts,
            topUsers,
            trendingCategories
        };
    }
};

export default StatisticsService;