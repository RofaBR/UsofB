import mysql_pool from "../db/mysql_pool.js";
import { createBaseModel } from "./BaseModel.js";
import CategoriesSchema from "../schemas/CategoriesSchema.js";

const CategoriesModel = {
    ...createBaseModel ("categories", mysql_pool, CategoriesSchema),
};

export default CategoriesModel