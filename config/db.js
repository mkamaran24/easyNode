const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Use getConnection to check the connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }

  console.log("Connected to MySQL. Connection ID:", connection.threadId);

  // Release the connection back to the pool
  connection.release();
});

module.exports = pool.promise();
