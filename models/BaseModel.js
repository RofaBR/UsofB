export default class BaseModel {
    constructor(tableName, db, SchemaClass) {
        this.tableName = tableName;
        this.db = db;
        this.SchemaClass = SchemaClass;
    }

    async create(data) {
        const schema = new this.SchemaClass(data);

        const keys = Object.keys(schema);
        const values = Object.values(schema);

        const placeholders = keys.map(() => "?").join(", ");
        const columns = keys.map(k => `\`${k}\``).join(", ");

        const sql = `INSERT INTO \`${this.tableName}\` (${columns}) VALUES (${placeholders})`;

        const [result] = await this.db.execute(sql, values);
        return { id: result.insertId, ...schema };
    }

    async findById(id) {
        const sql = `SELECT * FROM \`${this.tableName}\` WHERE id = ? LIMIT 1`;
        const [rows] = await this.db.execute(sql, [id]);
        return rows[0] ? new this.SchemaClass(rows[0]) : null;
    }

    async find(where = {}) {
        let sql = `SELECT * FROM \`${this.tableName}\``;
        const keys = Object.keys(where);
        let values = [];

        if (keys.length) {
            const conditions = keys.map(k => `\`${k}\` = ?`).join(" AND ");
            sql += ` WHERE ${conditions}`;
            values = Object.values(where);
        }

        const [rows] = await this.db.execute(sql, values);
        return rows.map(row => new this.SchemaClass(row));
    }

    async updateById(id, data) {
        const schema = new this.SchemaClass(data);

        const keys = Object.keys(schema);
        const values = Object.values(schema);

        const updates = keys.map(k => `\`${k}\` = ?`).join(", ");

        const sql = `UPDATE \`${this.tableName}\` SET ${updates} WHERE id = ?`;

        await this.db.execute(sql, [...values, id]);
        return this.findById(id);
    }

    async deleteById(id) {
        const sql = `DELETE FROM \`${this.tableName}\` WHERE id = ?`;
        await this.db.execute(sql, [id]);
        return true;
    }
}
