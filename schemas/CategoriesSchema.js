import { z } from "zod";

export const CategorySchema = z.object({
    id: z.number().optional(),
    title: z.string()
        .min(1, "Title is required")
        .max(255, "Title must be at most 255 characters"),
    description: z.string().optional(),
});


const CreateCategorySchema = CategorySchema.pick({ title: true, description: true });

const UpdateCategorySchema = CategorySchema.partial();
const ReadCategorySchema = CategorySchema;

export default {
    create: (data) => CreateCategorySchema.parse(data),
    update: (data) => UpdateCategorySchema.parse(data),
    read: (data) => ReadCategorySchema.parse(data),
};