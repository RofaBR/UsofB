import CategoriesModel from "../models/CategoriesModel.js"
import PostCategoriesModel from "../models/PostCategoriesModel.js";

const CategoriesService = {
    async getAllCategories() {
        return await CategoriesModel.find();
    },

    async create(data) {
        return await CategoriesModel.create(data);
    },

    async getCategory(data) {
        return await CategoriesModel.findById(data);
    },

    async updatedCategory(id, data) {
        return await CategoriesModel.updateById(id, data);
    },

    async deleteCategory(id) {
        return await CategoriesModel.deleteById(id);
    },

    async getPosts(category_id) {
        const postCategories = await PostCategoriesModel.findByCategoryId(category_id);
        return postCategories.map(row => row.post_id);
    },

    async getCategories(post_id) {
        const postCategories = await PostCategoriesModel.findByPostID(post_id);
        return postCategories.map(row => row.category_id);
    },

    async findAllWithIds(ids) {
        const categories =  await CategoriesModel.findAllWithIds(ids);
        return categories
    },
};

export default CategoriesService;