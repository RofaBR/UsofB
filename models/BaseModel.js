export default class BaseModel {
    constructor(tableName, db, SchemaClass) {
        this.tableName = tableName;
        this.db = db; 
        this.SchemaClass = SchemaClass; 
    }

    async create(data) {
        const schema = new this.SchemaClass(data);
        // schema.validate_*() calls here (maybe)
        const [result] = await this.db.query(
            `INSERT INTO \`${this.tableName}\` SET ?`, [schema]
        );
        return { id: result.insertId, ...schema };
    }

    async findById(id) {
        const [rows] = await this.db.query(
            `SELECT * FROM \`${this.tableName}\` WHERE id = ? LIMIT 1`, [id]
        );
        return rows[0] ? new this.SchemaClass(rows[0]) : null;
    }

    async find(where = {}) {
        let sql = `SELECT * FROM \`${this.tableName}\``;
        const keys = Object.keys(where);
        if (keys.length) {
            const conditions = keys.map(key => `\`${key}\` = ?`).join(' AND ');
            sql += ` WHERE ${conditions}`;
        }
        const [rows] = await this.db.query(sql, Object.values(where));
        return rows.map(row => new this.SchemaClass(row));
    }

    async updateById(id, data) {
        const schema = new this.SchemaClass(data);
        await this.db.query(
            `UPDATE \`${this.tableName}\` SET ? WHERE id = ?`, [schema, id]
        );
        return this.findById(id);
    }

    async deleteById(id) {
        await this.db.query(
            `DELETE FROM \`${this.tableName}\` WHERE id = ?`, [id]
        );
        return true;
    }
}