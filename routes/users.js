import express from "express";

import user_controller from "../controllers/user.js";
import validator from "../middlewares/userMiddleware.js"
import schema from "../schemas/UserSchema.js";
const user_router = express.Router();

user_router.get("/api/users", validator.validate(schema.register), auth_controller.post_register);
user_router.get("/api/users/:user_id", validator.validate(schema.register), auth_controller.post_register);
user_router.post("/api/users")

user_router.patch("/api/users/avatar")
user_router.patch("/api/users/:user_id")
user_router.delete("/api/users/:user_id")

export default user_router;