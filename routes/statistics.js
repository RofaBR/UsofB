import express from "express";
import statistics_controller from "../controllers/statistics.js";

const statistics_router = express.Router();

statistics_router.get("/api/statistics", statistics_controller.get_all_statistics);
statistics_router.get("/api/statistics/top-posts", statistics_controller.get_top_posts);
statistics_router.get("/api/statistics/top-users", statistics_controller.get_top_users);
statistics_router.get("/api/statistics/trending-categories", statistics_controller.get_trending_categories);

export default statistics_router;
