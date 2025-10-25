import express from "express";

import user_controller from "../controllers/user.js";
import validator from "../middlewares/baseMiddleware.js"
import schema from "../schemas/UserSchema.js";
import TokenValidator from "../middlewares/tokenMiddleware.js";
import avatarMiddleware from "../middlewares/avatarMiddleware.js";
import { requireRole } from "../middlewares/requireRole.js";

const user_router = express.Router();

user_router.get("/api/users", user_controller.get_Users);
user_router.get("/api/users/:user_id/favorites", TokenValidator.validateAccess(), user_controller.get_favorites);
user_router.get("/api/users/:user_id/stats", user_controller.get_user_stats);
user_router.get("/api/users/:user_id/comments", user_controller.get_user_comments);
user_router.get("/api/users/:user_id", TokenValidator.validateOptionalAccess(), user_controller.get_User);
user_router.post("/api/users", TokenValidator.validateAccess(), requireRole("admin"), validator.validate(schema.adminCreate), user_controller.post_create);
user_router.patch("/api/users/avatar", TokenValidator.validateAccess(), avatarMiddleware, user_controller.patch_uploadAvatar);
user_router.delete("/api/users/avatar", TokenValidator.validateAccess(), user_controller.delete_avatar);
user_router.post("/api/users/email-change", TokenValidator.validateAccess(), validator.validate(schema.email), user_controller.post_requestEmailChange);
user_router.post("/api/users/email-change/confirm/:token", user_controller.post_confirmEmailChange);
user_router.patch("/api/users/password", TokenValidator.validateAccess(), validator.validate(schema.passwordChange), user_controller.patch_updatePassword);
user_router.patch("/api/users/profile", TokenValidator.validateAccess(), validator.validate(schema.profileUpdate), user_controller.patch_updateProfile);
user_router.patch("/api/users/login", TokenValidator.validateAccess(), validator.validate(schema.loginChange), user_controller.patch_updateLogin);
user_router.patch("/api/users/:user_id", TokenValidator.validateAccess(), validator.validate(schema.userUpdate), user_controller.patch_updateUser);
user_router.patch("/api/admin/users/:user_id", TokenValidator.validateAccess(), requireRole("admin"), validator.validate(schema.adminUpdate), user_controller.patch_updateUser);
user_router.delete("/api/admin/users/:user_id", TokenValidator.validateAccess(), requireRole("admin"), user_controller.delete_User);
export default user_router;