import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "bolao",
  password: process.env.DB_PASSWORD || "bolao2026",
  database: process.env.DB_NAME || "bolao_copa",
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",
  dateStrings: true, // return DATETIME as 'YYYY-MM-DD HH:MM:SS' strings (UTC)
  timezone: "Z",     // interpret stored values as UTC
});

export default pool;
