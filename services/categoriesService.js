import CategoriesModel from "../models/CategoriesModel.js"

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
};

export default CategoriesService;