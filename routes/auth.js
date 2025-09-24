import express from "express";

import auth_controller from "../controllers/auth.js";
import validator from "../middlewares/baseMiddleware.js"
import tokenValidator from "../middlewares/tokenMiddleware.js";

import schema from "../schemas/UserSchema.js";
const auth_router = express.Router();

auth_router.post("/api/auth/register", validator.validate(schema.register), auth_controller.post_register);
auth_router.post("/api/auth/login", validator.validate(schema.login), auth_controller.post_login);
auth_router.post("/api/auth/logout", tokenValidator.validateRefresh(), auth_controller.post_logout);
auth_router.post("/api/auth/password-reset", validator.validate(schema.email),auth_controller.post_passwordReset);
auth_router.post("/api/auth/password-reset/:confirm_token", validator.validate(schema.passwordReset),auth_controller.post_confirmReset);
auth_router.post("/api/auth/email-confirm/:confirm_token", auth_controller.post_confirmEmail);
auth_router.post("/api/auth/refresh", tokenValidator.validateRefresh(), auth_controller.post_refreshToken); 
export default auth_router;