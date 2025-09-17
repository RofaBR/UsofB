import PostModel from "../models/PostModel.js"

const PostService = {
    async getPosts() {
        return await PostModel.findWithPagination();
    },
}

export default PostService