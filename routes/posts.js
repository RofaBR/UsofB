import express from "express";

import post_controller from "../controllers/post.js";
import PostSchema from "../schemas/PostsSchema.js";
import CommentSchema from "../schemas/CommentsSchema.js";
import validator from "../middlewares/baseMiddleware.js"
import TokenValidator from "../middlewares/tokenMiddleware.js";
import likeSchema from "../schemas/likeSchema.js";
import { requireRole } from "../middlewares/requireRole.js";
import { handleImageUpload } from "../middlewares/postImagesMiddleware.js";

const post_router = express.Router();

post_router.get("/api/posts", TokenValidator.validateOptionalAccess(), post_controller.get_posts);
post_router.get("/api/posts/:post_id", TokenValidator.validateOptionalAccess(), post_controller.get_post);
post_router.get("/api/posts/myposts/:user_id", post_controller.get_myposts);
post_router.get("/api/posts/:post_id/comments", TokenValidator.validateOptionalAccess(), post_controller.get_comments);
post_router.get("/api/posts/:post_id/categories", post_controller.get_categories);
post_router.get("/api/posts/:post_id/like", post_controller.get_likes);
post_router.get("/api/posts/:post_id/images", post_controller.get_post_images);
post_router.get("/api/posts/:post_id/subscribe", TokenValidator.validateAccess(), post_controller.get_subscribe_status);
post_router.post("/api/posts/:post_id/comments", TokenValidator.validateAccess(), validator.validate(CommentSchema.create), post_controller.post_comment);
post_router.post("/api/posts/", TokenValidator.validateAccess(), handleImageUpload, validator.validate(PostSchema.create), post_controller.post_createPost)
post_router.post("/api/posts/:post_id/like", TokenValidator.validateAccess(), validator.validate(likeSchema.create), post_controller.post_like);
post_router.post("/api/posts/:post_id/favorite", TokenValidator.validateAccess(), post_controller.post_favorite);
post_router.post("/api/admin/posts/:post_id/ban", TokenValidator.validateAccess(), requireRole("admin") ,post_controller.post_ban);
post_router.post("/api/posts/:post_id/subscribe", TokenValidator.validateAccess(), post_controller.post_subscribe);
post_router.post("/api/posts/:post_id/views", post_controller.post_increment_views);
post_router.patch("/api/posts/:post_id", TokenValidator.validateAccess(), handleImageUpload, validator.validate(PostSchema.update), post_controller.patch_post);
post_router.delete("/api/posts/:post_id/subscribe", TokenValidator.validateAccess(), post_controller.delete_subscribe);
post_router.delete("/api/posts/:post_id", TokenValidator.validateAccess(), post_controller.delete_post);
post_router.delete("/api/posts/:post_id/like", TokenValidator.validateAccess(), post_controller.delete_like);
post_router.delete("/api/posts/:post_id/favorite", TokenValidator.validateAccess(), post_controller.delete_favorite);

export default post_router;