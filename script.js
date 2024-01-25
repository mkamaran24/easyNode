const process = require("process");

process.argv.forEach((val, index) => {
  console.log(`${val}`);
});

const user_model = {
  ID: "int",
  Name: "string",
};

console.log(user_model);
