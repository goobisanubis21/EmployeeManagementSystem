const mysql = require("mysql");
const inquirer = require("inquirer");

// created the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",

  // Database port
  port: 3306,

  // Databade username
  user: "root",

  // Database password and name
  password: "password",
  database: "management"
});

// Database connection
connection.connect(function(err) {
  if (err) throw err;
// call function here
});

// create function here