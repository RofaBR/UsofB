import LikesModel from "../models/LikesModel.js"

const LikesService = {
    async postLike(data) {
        return await LikesModel.create(data);
    },

    async getAllLikes({ post_id, comment_id }) {
        if (post_id) {
            return await LikesModel.find({ post_id });
        } else if (comment_id) {
            return await LikesModel.find({ comment_id });
        }
        throw new Error("Either post_id or comment_id must be provided.");
    },

    async deleteLike({ author_id, post_id, comment_id }) {
        let likes;
        if (post_id) {
            likes = await LikesModel.find({ author_id, post_id });
        } else if (comment_id) {
            likes = await LikesModel.find({ author_id, comment_id });
        } else {
            throw new Error("Either post_id or comment_id must be provided.");
        }
        if (!likes.length) {
            throw new Error("Like not found for this user.");
        }
        await LikesModel.deleteLike(author_id, post_id, comment_id);
    }
};

export default LikesService;