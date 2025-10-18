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

        async findPaginated(options = {}) {
            const {
                page = 1,
                limit = 20,
                where = {},
                orderBy = 'id',
                orderDir = 'DESC',
                search = '',
                searchFields = []
            } = options;

            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            const offset = (pageNum - 1) * limitNum;

            const whereKeys = Object.keys(where);
            let whereClauses = [];
            let values = [];

            if (whereKeys.length > 0) {
                const conditions = whereKeys.map(k => `\`${k}\` = ?`);
                whereClauses.push(...conditions);
                values.push(...Object.values(where));
            }

            if (search && searchFields.length > 0) {
                const searchConditions = searchFields.map(field => `\`${field}\` LIKE ?`).join(' OR ');
                whereClauses.push(`(${searchConditions})`);
                searchFields.forEach(() => values.push(`%${search}%`));
            }

            const whereClause = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';

            let orderByClause = `\`${orderBy}\` ${orderDir}`;
            if (orderBy !== 'id') {
                orderByClause += ', `id` ASC';
            }

            const sql = `SELECT * FROM \`${tableName}\`${whereClause} ORDER BY ${orderByClause} LIMIT ${limitNum} OFFSET ${offset}`;
            const [rows] = await db.execute(sql, values);

            const countSql = `SELECT COUNT(*) as total FROM \`${tableName}\`${whereClause}`;
            const [countResult] = await db.execute(countSql, values);
            const total = countResult[0].total;

            return {
                data: rows.map(row => SchemaClass.read(row)),
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                    hasMore: pageNum * limitNum < total
                }
            };
        },

    };
};
