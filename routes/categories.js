import express from "express";

import categories_controller from "../controllers/categories.js";
import validator from "../middlewares/userMiddleware.js"

const categories_router = express.Router();

categories_router.get("/api/categories/")
categories_router.get("/api/categories/:category_id")
categories_router.get("/api/categories/:category_id/posts")
categories_router.post("/api/categories")
categories_router.patch("/api/categories/:category_id")
categories_router.delete("api/categories/:category_id")

export default categories_router;