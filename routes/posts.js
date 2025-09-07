import express from "express";

import post_controller from "../controllers/post.js";
import validator from "../middlewares/userMiddleware.js"

const post_router = express.Router();

post_router.get("/api/posts", post_controller.get_posts)
post_router.get("/api/posts/:post_id")
post_router.get("/api/posts/:post_id/comments")
post_router.post("/api/posts/:post_id/comments")
post_router.get("/api/posts/:post_id/categories")
post_router.get("/api/posts/:post_id/lile")
post_router.post("/api/posts/", post_controller.post_posts)
post_router.post("/api/posts/:post_id/like", post_controller.post_create_post)
post_router.patch("/api/posts/:post_id")
post_router.delete("/api/posts/:post_id")
post_router.delete("/api/posts/:post_id/like")

export default post_controller;