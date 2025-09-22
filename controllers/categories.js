import CategoriesService from "../services/categoriesService.js"
import PostService from "../services/postService.js";
import UserService from "../services/userService.js";

const categories_controller = {
    get_getAll: async (req, res) => {
        try {
            const categories = await CategoriesService.getAllCategories()
            return res.status(200).json({
                status: "Success",
                categories
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "CATEGORIES_FETCH_ERROR",
                message: err.message,
            });
        }
    },

    get_category: async (req, res) => {
        try {
            const category = await CategoriesService.getCategory(req.params.category_id);
            return res.status(200).json({
                status: "Success",
                category
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "CATEGORY_FETCH_ERROR",
                message: err.message,
            });
        }
    },

    get_specifiedPost : async (req, res) => {
        try {
            const post_ids = await CategoriesService.getPosts(req.params.category_id);
            const posts = await PostService.findAllWithIds(post_ids);
            return res.status(200).json({
                status: "Success",
                posts,
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "GET_POST_ASSOCIATED_WITH_CATEGORY_ERROR",
                message: err.message,
            });
        }
    },

    patch_Category: async (req, res) => {
        try {
            const updatedCategory = await CategoriesService.updatedCategory(req.params.category_id, req.validated);
            return res.status(200).json({
                status: "Success",
                category: updatedCategory
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "CATEGORY_UPDATE_ERROR",
                message: err.message,
            });
        }
    },

    delete_Category: async (req, res) => {
        try {
            await CategoriesService.deleteCategory(req.params.category_id)
            return res.status(204).send();
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "CATEGORY_DELETE_ERROR",
                message: err.message,
            });
        }
    },

    post_create: async(req, res) => {
        try {
            const category = await CategoriesService.create(req.validated)
            return res.status(201).json({
                status: "Success",
                category
            });
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "CATEGORY_CREATE_ERROR",
                message: err.message,
            });
        }
    },


}

export default categories_controller;