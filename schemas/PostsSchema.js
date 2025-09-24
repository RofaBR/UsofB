import { z } from "zod";

export const PostSchema = z.object({
    id: z.number().optional(),
    author_id: z.number().optional(),
    title: z.string().min(3, "Title must be at least 3 characters"),
    publish_date: z.coerce.date().optional(),
    status: z.enum(["active", "inactive"]).default("active"),
    content: z.string().min(1, "Content is required"),
    categories: z.array(z.number().min(1)).optional(),
    ban_status: z.coerce.boolean().default(false),
});

const PostCreateSchema = PostSchema.pick({
    author_id: true,
    title: true,
    content: true,
    status: true,
}).extend({
    categories: z.array(z.number().min(1, "Category ID must be positive")).optional(),
    ban_status: z.boolean().optional(),
});

const PostUpdateSchema = z.object({
    title: z.string().min(3).optional(),
    content: z.string().min(1).optional(),
    categories: z.array(z.number().min(1)).optional(),
});

const ReadPostSchema = PostSchema;

export default {
    create: (data) => PostCreateSchema.parse(data),
    update: (data) => PostUpdateSchema.parse(data),
    read: (data) => ReadPostSchema.parse(data),
};