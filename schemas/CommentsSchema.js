import { z } from "zod";

export const CommentSchema = z.object({
    id: z.number().optional(),
    author_id: z.number().optional(),
    post_id: z.coerce.number().optional(),
    create_at: z.date().optional(),
    content: z.string().min(1, "Content cannot be empty"),
});

const CommentCreateSchema = CommentSchema.pick({
    author_id: true,
    post_id: true,
    content: true,
});

const CommentUpdateSchema = CommentSchema.pick({
    content: true,
}).partial();

const CommentReadSchema = CommentSchema;

export default {
    create: (data) => CommentCreateSchema.parse(data),
    update: (data) => CommentUpdateSchema.parse(data),
    read: (data) => CommentReadSchema.parse(data),
};
