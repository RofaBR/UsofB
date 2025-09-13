import CategoriesService from "../services/categoriesService.js"

const categories_controller = {
    get_getAll: async (req, res) => {
        try {
            const categories = await CategoriesService.getAllCategories()
            res.json(categories);
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
            res.json(category);
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "CATEGORY_FETCH_ERROR",
                message: err.message,
            });
        }
    },

    patch_updateCategory: async (req, res) => {
        try {
            const updatedCategory = await CategoriesService.updatedCategory(req.params.category_id, req.validated);
            res.json(updatedCategory);
        } catch(err) {
            return res.status(400).json({
                status: "Fail",
                type: "CATEGORY_UPDATE_ERROR",
                message: err.message,
            });
        }
    },

    delete_deleteCategory: async (req, res) => {
        try {
            await CategoriesService.deleteCategory(req.params.category_id)
            return res.json({
                status: "Succses"
            })
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
            res.status(201).json(category);
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