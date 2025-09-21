import LikesModel from "../models/LikesModel.js"

const LikesService = {
    async postLike(data) {
        return await LikesModel.create(data);
    },

    async getAllLikes(data) {
        return await LikesModel.find(data)
    },

    async deleteLike({ author_id, target_type, target_id }) {
        const likes = await LikesModel.find({ author_id, target_type, target_id });
        if (!likes.length) {
            throw new Error("Like not found for this user.");
        }

        await LikesModel.deleteLike(author_id ,target_id, target_type);
    }
};

export default LikesService;