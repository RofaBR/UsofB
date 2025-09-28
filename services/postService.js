import PostModel from "../models/PostModel.js"
import PostCategoriesModel from "../models/PostCategoriesModel.js"
import PostImagesModel from "../models/PostImagesModel.js"
import NotificationService from "./NotificationService.js"

const PostService = {
    async getPosts(params) {
        return await PostModel.findWithFilters(params);
    },

    async getPost(post_id) {
        const post = await PostModel.findById(post_id);
        if (post) {
            post.images = await PostImagesModel.findByPostId(post_id);
        }
        return post;
    },

    async getFavorite(user_id) {
        return await PostModel.findFavoritesByUser(user_id)
    },

    async getMyPosts(params) {
        return await PostModel.getMyPosts(params);
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

    async addImages(postId, imagePaths) {
        const createdImages = [];
        for (const path of imagePaths) {
            const image = await PostImagesModel.create(postId, path);
            createdImages.push(image);
        }
        return createdImages;
    },

    async getPostImages(postId) {
        return await PostImagesModel.findByPostId(postId);
    },

    async deletePostImage(imageId, userId) {
        const image = await PostImagesModel.findById(imageId);
        if (!image) {
            throw new Error("Image not found");
        }
        const post = await PostModel.findById(image.post_id);
        if (!post) {
            throw new Error("Post not found");
        }
        if (post.author_id !== userId) {
            throw new Error("You are not allowed to delete this image");
        }
        await PostImagesModel.deleteById(imageId);
        return { success: true };
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

        try {
            await NotificationService.notifySubscribersOfPostUpdate(data.post_id, data.author_id);
        } catch (error) {
            console.error("Failed to create notifications for post update:", error.message);
        }

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
    },

    async postBan({post_id, ban_status }) {
        return await PostModel.updateById(post_id, { ban_status });
    }

}

export default PostService