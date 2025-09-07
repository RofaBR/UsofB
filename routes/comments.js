import express from "express";

import validator from "../middlewares/userMiddleware.js"

const comments_router = express.Router();

comments_router.get("/api/comments/:comment_id")
comments_router.get("/api/comments/:commnet_id/like")
comments_router.post("/api/comments/:comment_id/like")
comments_router.patch("/api/comments/:comment_id")
comments_router.delete("/api/comments/:comment_id")
comments_router.delete("/api/comments/:comment_id/like")

export default comments_router;