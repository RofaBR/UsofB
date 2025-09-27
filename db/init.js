import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootConfig = {
    host: process.env.DB_HOST,
    user: 'root',
    password: process.env.ROOT_PASSWORD,
    multipleStatements: true
};

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
};

async function runSqlFile(connection, filePath) {
    const sql = await fs.readFile(filePath, 'utf8');
    const statements = sql.split(';').map(s => s.trim()).filter(Boolean);
    for (const stmt of statements) {
        await connection.query(stmt);
    }
}

async function initializeDatabase() {
  let connection;

  try {
    connection = await mysql.createConnection(rootConfig);

    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await connection.execute(`DROP USER IF EXISTS '${process.env.DB_USER}'@'localhost'`);
    await connection.execute(`CREATE USER '${process.env.DB_USER}'@'localhost' IDENTIFIED BY '${process.env.DB_PASSWORD}'`);
    await connection.execute(`GRANT ALL PRIVILEGES ON \`${process.env.DB_NAME}\`.* TO '${process.env.DB_USER}'@'localhost'`);
    await connection.execute('FLUSH PRIVILEGES');
    await connection.end();

    connection = await mysql.createConnection(dbConfig);

    const sqlFiles = [
      'users.sql',
      'refresh_tokens.sql',
      'categories.sql',
      'post.sql',
      'comments.sql',
      'like.sql',
      'favorite.sql'
    ];

    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, 'sql', file);
      await runSqlFile(connection, filePath);
    }

    await connection.end();
  } catch (err) {
        console.error('Database initialization failed:', err.message);
        process.exit(1);
  } finally {
        if (connection) await connection.end();
  }
}

if (import.meta.url.startsWith('file://') && process.argv[1]?.includes('init.js')) {
  initializeDatabase();
}

export { initializeDatabase };