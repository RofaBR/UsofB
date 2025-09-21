import { z } from "zod";

export const PostCategoriesSchema = z.object({
    post_id: z.number().min(1, "Post ID is required"),
    category_id: z.number().min(1, "Category ID is required"),
});

const PostCategoriesCreateSchema = PostCategoriesSchema;
const PostCategoriesUpdateSchema = PostCategoriesSchema.partial();

export default {
    create: (data) => PostCategoriesCreateSchema.parse(data),
    update: (data) => PostCategoriesUpdateSchema.parse(data),
    read: (data) => PostCategoriesSchema.parse(data),
};
