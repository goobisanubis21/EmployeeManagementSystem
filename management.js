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
connection.connect(function (err) {
    if (err) throw err;
    questions();
});

// create function here
function questions() {
    // prompt for main question to move onto next set of questions
    inquirer
        .prompt([
            {
                name: 'main',
                type: 'list',
                message: 'What would you like to do?',
                choices: ["Add new employee", "Update an employee's role", "Terminate employee", "View all employees", "View all departments", "View all roles"]
            }
        ])
        // based upon users first answer run the function for that response
        .then(function(answer) {
                if (answer.main === "Add new employee") {
                    addEmployee();
                } else if (answer.main === "Update an employee's role") {
                    updateEmployee();
                } else if (answer.main === "View all employees") {
                    viewAllEmployees();
                } else if (answer.main === "View all departments") {
                    viewAllDepartments();
                } else if (answer.main === "View all roles") {
                    viewAllRoles();
                } else if (answer.main === "Terminate employee") {
                    fired();
                } else {
                    connection.end();
                }
        });
}