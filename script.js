require("dotenv").config();

const process = require("process");
var fs = require("fs");
const mysql = require("mysql2/promise");
const chalk = require("chalk");

const folderPath = "src/database/migration";

const table_check = `SELECT COUNT(*) 
FROM information_schema.tables
WHERE table_schema = 'test' 
    AND table_name = 'category';`;

const category_table = `
  CREATE TABLE IF NOT EXISTS category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
  )
`;

if (process.argv[2] == "make") {
  if (process.argv[3] == "migration") {
    let table_arg4 = process.argv[4];
    let table_name = table_arg4.toLowerCase();

    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    // let sec = date.getSeconds();
    let sec = date.getTime() / 1000;

    let currentDate = `${year}_${month}_${day}_${sec}`;

    fs.writeFile(
      `src/database/migration/${currentDate}_${table_name}_create_table.sql`,
      `CREATE TABLE IF NOT EXISTS ${table_name} (
    id INT AUTO_INCREMENT PRIMARY KEY
)`,
      function (err) {
        if (err) throw err;
        console.log("Saved!");
      }
    );
  } else if (process.argv[3] == "controller") {
  } else if (process.argv[3] == "route") {
  }
} else if (process.argv[2] == "migrate") {
  if (process.argv[3] == "status") {
    console.log("There is no migrate process !!");
    return; // this is just for stoping excution of code
  }
  // migrate process //////////////////
  const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
  // Read the contents of the folder ////////////
  fs.readdir(folderPath, async (err, filePaths) => {
    if (err) {
      console.error("Error reading folder:", err);
      return;
    }

    // Read the contents of each file asynchronously
    const fileContentsArray = [];

    // Function to read the contents of a file
    async function readFileAsync(filePath) {
      return new Promise((resolve, reject) => {
        fs.readFile(filePath, "utf8", (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    }

    // Function to read files and push content into the array
    async function readFiles() {
      for (const filePath of filePaths) {
        try {
          const fileContent = await readFileAsync(
            `src/database/migration/${filePath}`
          );
          fileContentsArray.push(fileContent);
        } catch (err) {
          console.error(`Error reading file ${filePath}:`, err);
        }
      }

      // Now 'fileContentsArray' contains the contents of each file

      // Create a connection pool
      const pool = mysql.createPool(dbConfig);

      try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        console.log(" ");
        console.log("===========================");
        console.log(chalk.blue("INFO: ") + "Running migrations");
        console.log("===========================");
        console.log(" ");
        // Execute each SQL statement individually
        for (let i = 0; i < fileContentsArray.length; i++) {
          const sqlStatement = fileContentsArray[i];
          try {
            const [results, fields] = await connection.query(sqlStatement);
            console.log(chalk.green("Migrated: ") + filePaths[i]);
          } catch (queryErr) {
            console.log(" ");
            console.log("===========================");
            console.log(chalk.redBright("WARNING: ") + "Failling migrations");
            console.log("===========================");
            console.log(" ");
            console.error(`Error executing query ${i + 1}:`, queryErr);
          }
        }
      } catch (connectionErr) {
        console.error("Error establishing database connection:", connectionErr);
      } finally {
        // Release the connection back to the pool
        if (pool && pool.end) {
          pool.end();
        }
      }
    }

    // Call the function to read files
    readFiles();
  });
  // end of Read the contents of the folder ////
  //////
  // end of migrate process
}
