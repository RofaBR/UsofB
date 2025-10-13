import express from "express";

import categories_controller from "../controllers/categories.js";
import TokenValidator from "../middlewares/tokenMiddleware.js";
import validator from "../middlewares/baseMiddleware.js"
import schema from "../schemas/CategoriesSchema.js";
import { requireRole } from "../middlewares/requireRole.js";

const categories_router = express.Router();

categories_router.get("/api/categories/", categories_controller.get_getAll);
categories_router.get("/api/admin/categories/:category_id", TokenValidator.validateAccess(), requireRole("admin"),categories_controller.get_category);
categories_router.get("/api/admin/categories/:category_id/posts", TokenValidator.validateAccess(), requireRole("admin"), categories_controller.get_specifiedPost);
categories_router.post("/api/admin/categories", TokenValidator.validateAccess(), requireRole("admin"), validator.validate(schema.create), categories_controller.post_create);
categories_router.patch("/api/admin/categories/:category_id", TokenValidator.validateAccess(), requireRole("admin"), validator.validate(schema.update), categories_controller.patch_Category);
categories_router.delete("/api/admin/categories/:category_id", TokenValidator.validateAccess(), requireRole("admin"), categories_controller.delete_Category);

export default categories_router;