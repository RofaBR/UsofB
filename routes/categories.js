import express from "express";

import categories_controller from "../controllers/categories.js";
import tokenValidator from "../middlewares/tokenMiddleware.js";
import validator from "../middlewares/baseMiddleware.js"
import schema from "../schemas/CategoriesSchema.js";

const categories_router = express.Router();

categories_router.get("/api/categories/", tokenValidator.validateAccess(), categories_controller.get_getAll);
categories_router.get("/api/categories/:category_id", tokenValidator.validateAccess(), categories_controller.get_category);
// categories_router.get("/api/categories/:category_id/posts")
categories_router.post("/api/categories", tokenValidator.validateAccess(), validator.validate(schema.create), categories_controller.post_create);
categories_router.patch("/api/categories/:category_id", tokenValidator.validateAccess(), validator.validate(schema.update), categories_controller.patch_updateCategory);
categories_router.delete("api/categories/:category_id", tokenValidator.validateAccess(), categories_controller.delete_deleteCategory);

// categories_router.get("/api/categories/",categories_controller.get_getAll);
// categories_router.get("/api/categories/:category_id", categories_controller.get_category);
// categories_router.patch("/api/categories/:category_id", validator.validate(schema.update), categories_controller.patch_updateCategory);
//categories_router.delete("/api/categories/:category_id", categories_controller.delete_deleteCategory);
export default categories_router;