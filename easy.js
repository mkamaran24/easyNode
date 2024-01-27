require("dotenv").config();

const process = require("process");
var fs = require("fs");
const mysql = require("mysql2/promise");
const chalk = require("chalk");
const figlet = require("figlet");

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
} else if (process.argv[2] == "--help" || process.argv[2] == "-h") {
  console.log(" ");

  const bannerText = "SkySoft";

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
    console.log(chalk.bold.blue(data));
    console.log(" ");
    console.log("Easy CLI " + chalk.green("1.0.0"));
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


'1Row',           '3-D',           '3D Diagonal',
  '3D-ASCII',       '3x5',           '4Max',
  '5 Line Oblique', 'Acrobatic',     'Alligator',
  'Alligator2',     'Alpha',         'Alphabet',
  'AMC 3 Line',     'AMC 3 Liv1',    'AMC AAA01',
  'AMC Neko',       'AMC Razor',     'AMC Razor2',
  'AMC Slash',      'AMC Slider',    'AMC Thin',
  'AMC Tubes',      'AMC Untitled',  'ANSI Regular',
  'ANSI Shadow',    'Arrows',        'ASCII New Roman',
  'Avatar',         'B1FF',          'Banner',
  'Banner3-D',      'Banner3',       'Banner4',
  'Barbwire',       'Basic',         'Bear',
  'Bell',           'Benjamin',      'Big Chief',
  'Big Money-ne',   'Big Money-nw',  'Big Money-se',
  'Big Money-sw',   'Big',           'Bigfig',
  'Binary',         'Block',         'Blocks',
  'Bloody',         'Bolger',        'Braced',
  'Bright',         'Broadway KB',   'Broadway',
  'Bubble',         'Bulbhead',      'Caligraphy',
  'Caligraphy2',    'Calvin S',      'Cards',
  'Catwalk',        'Chiseled',      'Chunky',
  'Coinstak',       'Cola',          'Colossal',
  'Computer',       'Contessa',      'Contrast',
  'Cosmike',        'Crawford',      'Crawford2',
  'Crazy',          'Cricket',       'Cursive',
  'Cyberlarge',     'Cybermedium',   'Cybersmall',
  'Cygnet',         'DANC4',         'Dancing Font',
  'Decimal',        'Def Leppard',   'Delta Corps Priest 1',
  'Diamond',        'Diet Cola',     'Digital',
  'Doh',            'Doom',          'DOS Rebel',
  'Dot Matrix',     'Double Shorts', 'Double',
  'Dr Pepper',      'DWhistled',     'Efti Chess',
  'Efti Font',      'Efti Italic',   'Efti Piti',
  'Efti Robot',

*/
