import express from "express";

import user_controller from "../controllers/user.js";
import validator from "../middlewares/baseMiddleware.js"
import schema from "../schemas/UserSchema.js";
import TokenValidator from "../middlewares/tokenMiddleware.js";
import avatarMiddleware from "../middlewares/avatarMiddleware.js";

const user_router = express.Router();

user_router.get("/api/users", TokenValidator.validateAccess(), user_controller.get_getAllUsers);
user_router.get("/api/users/:user_id", TokenValidator.validateAccess(), user_controller.get_getUser);
user_router.post("/api/users", TokenValidator.validateAccess(), validator.validate(schema.adminCreate), user_controller.post_create);
user_router.patch("/api/users/avatar", TokenValidator.validateAccess(), avatarMiddleware, user_controller.patch_uploadAvatar);         
user_router.patch("/api/users/:user_id", TokenValidator.validateAccess(), validator.validate(schema.update), user_controller.patch_updateUser);
user_router.delete("/api/users/:user_id", TokenValidator.validateAccess(), user_controller.delete_deleteUser);
export default user_router;