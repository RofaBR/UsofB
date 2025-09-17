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
        },

        async findWithPagination({ cursor = null, limit = 10, orderBy = "id", direction = "ASC", where = {} }) {
            let sql = `SELECT * FROM \`${tableName}\``;
            let values = [];

            const keys = Object.keys(where);
            if (keys.length) {
                const conditions = keys.map(k => `\`${k}\` = ?`).join(" AND ");
                sql += ` WHERE ${conditions}`;
                values = [...Object.values(where)];
            }

            if (cursor !== null) {
                sql += keys.length ? " AND" : " WHERE";
                sql += direction === "ASC"
                    ? ` \`${orderBy}\` > ?`
                    : ` \`${orderBy}\` < ?`;
                values.push(cursor);
            }

            sql += ` ORDER BY \`${orderBy}\` ${direction} LIMIT ?`;
            values.push(limit + 1);

            const [rows] = await db.execute(sql, values);
            const data = rows.slice(0, limit).map(row => SchemaClass.read(row));

            const nextCursor = rows.length > limit ? rows[limit - 1][orderBy] : null;

            return {
                data,
                nextCursor,
                hasNextPage: rows.length > limit,
            };
        }
    };
};
