import CommentModel from "../models/CommentModel.js";

const CommentsService = {
    async create(data) {
        return await CommentModel.create(data);
    },

    async getComment(id) {
        return await CommentModel.findById(id);
    },

    async updateComment(author_id, id, data) {
        const comment = await CommentModel.find({author_id, id})
        if (!comment.length) {
            throw new Error("There is no comment from this user.");
        }
        return await CommentModel.updateById(id, data);
    },
    
    async deleteComment(author_id, id) {
        const comment = await CommentModel.find({author_id, id})
        if (!comment.length) {
            throw new Error("There is no comment from this user.");
        }
        return await CommentModel.deleteById(id);
    },

    async findAllCommentsToPost(post_id) {
        return await CommentModel.find({ post_id });
    },

    async getPaginatedComments(post_id, page = 1, limit = 20, userId = null) {
        return await CommentModel.findPaginatedWithDetails({
            page,
            limit,
            post_id,
            userId
        });
    },

    async getUserComments(userId, page = 1, limit = 20) {
        return await CommentModel.findByAuthorId(userId, page, limit);
    }
};

export default CommentsService