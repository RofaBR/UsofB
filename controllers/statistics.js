import StatisticsService from "../services/statisticsService.js";

const statistics_controller = {
    get_all_statistics: async (req, res) => {
        try {
            const statistics = await StatisticsService.getAllStatistics();
            return res.status(200).json({
                status: "Success",
                statistics
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "STATISTICS_FETCH_ERROR",
                message: err.message
            });
        }
    },

    get_top_posts: async (req, res) => {
        try {
            const topPosts = await StatisticsService.getTopRatedPosts();
            return res.status(200).json({
                status: "Success",
                topPosts
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "TOP_POSTS_FETCH_ERROR",
                message: err.message
            });
        }
    },
    
    get_top_users: async (req, res) => {
        try {
            const topUsers = await StatisticsService.getTopRatedUsers();
            return res.status(200).json({
                status: "Success",
                topUsers
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "TOP_USERS_FETCH_ERROR",
                message: err.message
            });
        }
    },

    get_trending_categories: async (req, res) => {
        try {
            const trendingCategories = await StatisticsService.getTrendingCategories();
            return res.status(200).json({
                status: "Success",
                trendingCategories
            });
        } catch (err) {
            return res.status(400).json({
                status: "Fail",
                type: "TRENDING_CATEGORIES_FETCH_ERROR",
                message: err.message
            });
        }
    }
};

export default statistics_controller;