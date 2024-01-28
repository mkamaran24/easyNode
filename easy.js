require("dotenv").config();

const process = require("process");
var fs = require("fs");
const mysql = require("mysql2/promise");
const chalk = require("chalk");
const figlet = require("figlet");

const folderPath = "src/database/migration";

const table_check = `SELECT COUNT(*) 
FROM information_schema.tables
WHERE table_schema = 'node' 
    AND table_name = 'migration';`;

const migration_table = `
  CREATE TABLE IF NOT EXISTS migration (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
  )
`;

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let flag;

function path_exist(fpath, rows) {
  const exists = rows.some((row) => row.name === fpath);
  return exists;
}

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
        console.log(" ");
        console.log(
          chalk.green("Created Migration: ") +
            `${currentDate}_${table_name}_create_table.sql`
        );
        console.log(" ");
      }
    );
  } else if (process.argv[3] == "controller") {
  } else if (process.argv[3] == "route") {
  }
} else if (process.argv[2] == "migrate") {
  if (process.argv[3] == "status") {
    async function is_mig() {
      // Create a connection pool
      const pool = mysql.createPool(dbConfig);
      try {
        const connection = await pool.getConnection();
        try {
          const [results, fields] = await connection.execute(table_check);
          if (results[0]["COUNT(*)"] != 0) {
            console.log("Not Zero");
          } else {
            console.log(" ");
            console.log(chalk.bgRed("WARNING: there is no migration table!!"));
            console.log(" ");
          }
        } catch (error) {
          console.error(`Error executing query: \n`, error);
        }
      } catch (connectionErr) {
        console.error(
          `Error establishing database connection:: \n`,
          connectionErr
        );
      } finally {
        if (pool && pool.end) {
          pool.end();
        }
      }
    }
    is_mig();
    return; // this is just for stoping excution of code
  }
  // migrate process //////////////////

  // Read the contents of the folder ////////////
  fs.readdir(folderPath, async (err, filePaths) => {
    // Create a connection pool
    const pool = mysql.createPool(dbConfig);
    if (err) {
      console.error("Error reading folder:", err);
      return;
    }
    const fileContentsArray = [];
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
    async function readFiles() {
      try {
        // Get a connection from the pool
        const connection = await pool.getConnection();

        const [results, fields] = await connection.execute(table_check);
        if (results[0]["COUNT(*)"] != 0) {
          // if migration table exist

          const [rows, fields] = await connection.query(
            "select name from migration"
          );

          // console.log(rows);
          for (const filePath of filePaths) {
            try {
              // console.log(path_exist(filePath, rows));
              if (path_exist(filePath, rows)) {
                flag = true;
                continue;
              } else {
                flag = false;
                const insert = "insert into migration (name) values (?)";
                const { rows, fields } = await connection.query(insert, [
                  filePath,
                ]);
                const fileContent = await readFileAsync(
                  `src/database/migration/${filePath}`
                );
                fileContentsArray.push(fileContent);
              }
            } catch (err) {
              console.error(`Error reading file ${filePath}:`, err);
            }
          }

          // flag for terminating script
          if (flag) {
            console.log(" ");
            console.log(chalk.bgMagenta("All migartions are running !!"));
            console.log(" ");
            return;
          }
          // end of termination
        } else {
          const [results, fields] = await connection.query(migration_table);
          console.log(" ");
          console.log(chalk.bgMagenta("Creating Migration Process..."));

          for (const filePath of filePaths) {
            try {
              const insert = "insert into migration (name) values (?)";
              const { rows, fields } = await connection.query(insert, [
                filePath,
              ]);
              const fileContent = await readFileAsync(
                `src/database/migration/${filePath}`
              );
              fileContentsArray.push(fileContent);
            } catch (err) {
              console.error(`Error reading file ${filePath}:`, err);
            }
          }
        } // if migration table not exist

        // Now 'fileContentsArray' contains the contents of each file

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
        console.error(chalk.bgRed("Error establishing database connection:"));
      } finally {
        // Release the connection back to the pool
        if (pool && pool.end) {
          pool.end();
        }
      }
    }
    readFiles();
  });
  // end of Read the contents of the folder ////
  //////
  // end of migrate process
} else if (process.argv[2] == "--help" || process.argv[2] == "-h") {
  console.log(" ");

  const bannerText = " EasyCLi";

  const figletOptions = {
    font: "univers",
    letterSpacing: 1,
  };

  // figlet.fonts(function (err, fonts) {
  //   if (err) {
  //     console.log("Error fetching fonts...");
  //     console.dir(err);
  //     return;
  //   }

  //   console.log("Available fonts:");
  //   console.log(fonts);
  // });

  figlet(bannerText, figletOptions, function (err, data) {
    if (err) {
      console.log("Something went wrong...");
      console.dir(err);
      return;
    }
    console.log(chalk.blue(data));
    console.log(" ");
    console.log(" Easy CLI " + chalk.green("1.0.0"));
    console.log(" Powred BY: " + chalk.green(" Mohammed Kamaran"));
    console.log(" ");
    console.log(chalk.yellow("Options: "));
    console.log(
      chalk.green("-h, --help ") + "         Display help for the given command"
    );
    console.log(
      chalk.green("-v, --version ") +
        "      Display Express application version"
    );
    console.log(
      chalk.green("-l, --list ") +
        "         List all routes for this application"
    );
    console.log(" ");
    console.log(chalk.yellow("Available commands: "));
    console.log(
      chalk.green("route -l ") + "           List all registered routes"
    );
    console.log(
      chalk.green("migrate ") +
        "            Migrating all migration fiels to DB"
    );
    console.log(
      chalk.green("migrate status") + "      Show the status of each migration"
    );
    console.log(
      chalk.green("make migration ") +
        "     Creating new migartoin files (.sql)"
    );
    console.log(
      chalk.green("make controller ") + "    Create a new controller script"
    );
  });
}

/*
univers
poison
roman
*/
