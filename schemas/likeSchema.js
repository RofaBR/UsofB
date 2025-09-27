import { z } from "zod";

export const LikeSchema = z.object({
    id: z.number().optional(),
    author_id: z.number().optional(),
    post_id: z.number().nullable().optional(),
    comment_id: z.number().nullable().optional(),
    type: z.enum(["like", "dislike"]),
    created_at: z.date().optional(),
}).refine(
    (data) =>
        (data.post_id && !data.comment_id) ||
        (!data.post_id && data.comment_id),
    {
        message: "Either post_id or comment_id must be set, but not both.",
        path: ["post_id", "comment_id"],
    }
);

const LikeCreateSchema = LikeSchema.pick({
    author_id: true,
    post_id: true,
    comment_id: true,
    type: true,
});

const LikeUpdateSchema = LikeSchema.pick({
    type: true,
}).partial();

const LikeReadSchema = LikeSchema;

export default {
    create: (data) => LikeCreateSchema.parse(data),
    update: (data) => LikeUpdateSchema.parse(data),
    read: (data) => LikeReadSchema.parse(data),
};