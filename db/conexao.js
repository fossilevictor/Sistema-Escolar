
import 'dotenv/config';
import mysql from 'mysql2/promise';

// Conexão com o banco de dados
const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306)
});

// Exportação da conexão
export default db;
