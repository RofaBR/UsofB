import { z } from "zod";

export const LikeSchema = z.object({
    id: z.number().optional(),
    author_id: z.number().optional(),
    target_type: z.enum(["post", "comment"]).optional(),
    target_id: z.coerce.number().optional(),
    type: z.enum(["like", "dislike"]),
    created_at: z.date().optional(),
});

const LikeCreateSchema = LikeSchema.pick({
    author_id: true,
    target_type: true,
    target_id: true,
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
