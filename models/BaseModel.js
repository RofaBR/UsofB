export const createBaseModel = (tableName, db, SchemaClass) => {
    return {
        async create(data) {
            const schema = SchemaClass.create(data);

            const keys = Object.keys(schema);
            const values = Object.values(schema);

            const placeholders = keys.map(() => "?").join(", ");
            const columns = keys.map(k => `\`${k}\``).join(", ");

            const sql = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
            const [result] = await db.execute(sql, values);

            return { id: result.insertId, ...schema };
        },

        async findById(id) {
            const sql = `SELECT * FROM \`${tableName}\` WHERE id = ?`;
            const [rows] = await db.execute(sql, [id]);
            return rows[0] ? SchemaClass.read(rows[0]) : null;
        },

        async find(where = {}) {
            let sql = `SELECT * FROM \`${tableName}\``;
            const keys = Object.keys(where);
            let values = [];

            if (keys.length) {
                const conditions = keys.map(k => `\`${k}\` = ?`).join(" AND ");
                sql += ` WHERE ${conditions}`;
                values = Object.values(where);
            }

            const [rows] = await db.execute(sql, values);

            return rows.map(row => SchemaClass.read(row));
        },


        async updateById(id, data) {
            const schema = SchemaClass.update(data)

            const keys = Object.keys(schema);
            const values = Object.values(schema);

            const updates = keys.map(k => `\`${k}\` = ?`).join(", ");

            const sql = `UPDATE \`${tableName}\` SET ${updates} WHERE id = ?`;
            await db.execute(sql, [...values, id]);

            return this.findById(id);
        },

        async deleteById(id) {
            const sql = `DELETE FROM \`${tableName}\` WHERE id = ?`;
            await db.execute(sql, [id]);
            return true;
        }
    };
};
