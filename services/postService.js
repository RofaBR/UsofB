import PostModel from "../models/PostModel.js"
import PostCategoriesModel from "../models/PostCategoriesModel.js"

const PostService = {
    async getPosts(params) {
        return await PostModel.findWithFilters(params);
    },

    async getPost(post_id) {
        return await PostModel.findById(post_id);
    },

    async findAllWithIds(ids) {
        const posts =  await PostModel.findAllWithIds(ids);
        return posts
    },

    async createPost(data) {
        const post = await PostModel.create({
            author_id: data.author_id,
            title: data.title,
            content: data.content,
            status: data.status || "active"
        });

        if (data.categories && data.categories.length > 0) {
            for (const categoryId of data.categories) {
                await PostCategoriesModel.create(post.id, categoryId);
            }           
        }

        return { id: post.id };
    },
    
    async updatePost(data) {
        const post = await PostModel.findById(data.post_id);
        if (!post) {
            throw new Error("Post not found");
        }
        if (post.author_id !== data.author_id) {
            throw new Error("You are not allowed to update this post");
        }
        await PostCategoriesModel.deleteByPostId(data.post_id)
        if (data.categories && data.categories.length > 0) {
            for (const categoryId of data.categories) {
                await PostCategoriesModel.create(data.post_id, categoryId);
            }
        }
        const newPostData = await PostModel.updateById(data.post_id, {
            title: data.title,
            content: data.content,
            status: data.status
        });
        return { newPostData };
    },

    async deletePost(data) {
        const post = await PostModel.findById(data.post_id);
        if (!post) {
            throw new Error("Post not found");
        }
        if (post.author_id !== data.author_id) {
            throw new Error("You are not allowed to delete this post");
        }
        return await PostModel.deleteById(data.post_id);
    }

}

export default PostService