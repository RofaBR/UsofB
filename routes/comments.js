import express from "express";

import validator from "../middlewares/baseMiddleware.js"
import comments_controller from "../controllers/comments.js"
import TokenValidator from "../middlewares/tokenMiddleware.js";
import likeSchema from "../schemas/likeSchema.js";
import CommentsSchema from "../schemas/CommentsSchema.js";
import { requireRole } from "../middlewares/requireRole.js";

const comments_router = express.Router();

comments_router.get("/api/comments/:comment_id", TokenValidator.validateAccess(), comments_controller.get_comment);
comments_router.get("/api/comments/:comment_id/like", comments_controller.get_like);
comments_router.post("/api/comments/:comment_id/like", TokenValidator.validateAccess(), validator.validate(likeSchema.create), comments_controller.post_like);
comments_router.patch("/api/comments/:comment_id", TokenValidator.validateAccess(), validator.validate(CommentsSchema.update), comments_controller.patch_comment);
comments_router.delete("/api/comments/:comment_id", TokenValidator.validateAccess(), comments_controller.delete_comment);
comments_router.delete("/api/comments/:comment_id/like", TokenValidator.validateAccess(), comments_controller.delete_like);

export default comments_router;