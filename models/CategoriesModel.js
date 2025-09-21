import mysql_pool from "../db/mysql_pool.js";
import { createBaseModel } from "./BaseModel.js";
import CategoriesSchema from "../schemas/CategoriesSchema.js";

const CategoriesModel = {
    ...createBaseModel ("categories", mysql_pool, CategoriesSchema),

    async findAllWithIds(category_ids) {
        if (!category_ids || category_ids.length === 0) return [];
        const placeholders = category_ids.map(() => "?").join(", ");
        const sql = `SELECT * FROM categories WHERE id IN (${placeholders})`;
        const [rows] = await mysql_pool.execute(sql, category_ids);
        return rows.map(row => CategoriesSchema.read(row));
    }
};

export default CategoriesModel