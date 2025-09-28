import PostModel from "../models/PostModel.js"
import PostCategoriesModel from "../models/PostCategoriesModel.js"
import NotificationService from "./NotificationService.js"
import PostImageService from "./postImageService.js"

const PostService = {
    async getPosts(params) {
        return await PostModel.findWithFilters(params);
    },

    async getPost(post_id) {
        const post = await PostModel.findById(post_id);
        if (post) {
            post.images = PostImageService.getPostImages(post_id);
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

    async createPost(data, uploadedImages = []) {
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

        let savedImages = [];
        if (uploadedImages && uploadedImages.length > 0) {
            savedImages = PostImageService.moveUploadedImages(post.id, uploadedImages);
        }

        return {
            id: post.id,
            images: savedImages
        };
    },

    async getPostImages(postId) {
        return PostImageService.getPostImages(postId);
    },

    async clearPostImages(postId, userId) {
        const post = await PostModel.findById(postId);
        if (!post) {
            throw new Error("Post not found");
        }
        if (post.author_id !== userId) {
            throw new Error("You are not allowed to manage images for this post");
        }
        return PostImageService.clearPostImages(postId);
    },
    
    async updatePost(data, uploadedImages = []) {
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

        let updatedImages = [];
        if (uploadedImages && uploadedImages.length > 0) {
            PostImageService.clearPostImages(data.post_id);
            updatedImages = PostImageService.moveUploadedImages(data.post_id, uploadedImages);
        }

        try {
            await NotificationService.notifySubscribersOfPostUpdate(data.post_id, data.author_id);
        } catch (error) {
            console.error("Failed to create notifications for post update:", error.message);
        }

        return {
            newPostData,
            images: updatedImages.length > 0 ? updatedImages : PostImageService.getPostImages(data.post_id)
        };
    },

    async deletePost(data) {
        const post = await PostModel.findById(data.post_id);
        if (!post) {
            throw new Error("Post not found");
        }
        if (post.author_id !== data.author_id) {
            throw new Error("You are not allowed to delete this post");
        }

        try {
            PostImageService.deletePostImageDirectory(data.post_id);
        } catch (error) {
            console.error(`Failed to delete images for post ${data.post_id}:`, error.message);
        }

        return await PostModel.deleteById(data.post_id);
    },

    async postBan({post_id, ban_status }) {
        return await PostModel.updateById(post_id, { ban_status });
    }

}

export default PostService