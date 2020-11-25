const mysql = require("mysql");
const inquirer = require("inquirer");
const table = require('console.table');

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
                choices: ["Veiw all", "View all employees", "Add new employee", "Update an employee's role", "Terminate employee", "View all departments", "View all roles", "Exit"]
            }
        ])
        // based upon users first answer run the function for that response
        .then(function (answer) {
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
            } else if (answer.main === "Veiw all") {
                viewAll();
            } else {
                connection.end();
            }
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                name: 'department',
                type: 'input',
                message: "Which department will this employee be working in?"
            }
        ])
        .then(function (departmentAnswer) {
            connection.query(
                'INSERT INTO departments SET ?',
                {
                    department: departmentAnswer.department
                }
            )
            inquirer
                .prompt([
                    {
                        name: 'roleTitle',
                        type: 'input',
                        message: "What is this employee's title?"
                    },
                    {
                        name: 'salary',
                        type: 'input',
                        message: "What is this employee's salary?",
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            console.log('Salary must be a number.');
                            return false;
                        }
                    }
                ])
                .then(function (roleAnswer) {
                    connection.query(
                        'INSERT INTO role SET ?',
                        {
                            title: roleAnswer.roleTitle,
                            salary: roleAnswer.salary
                        }
                    )
                    inquirer
                        .prompt([
                            {
                                name: 'first',
                                type: 'input',
                                message: 'What is the new employees first name?'
                            },
                            {
                                name: 'last',
                                type: 'input',
                                message: 'What is the new employees last name?'
                            }
                        ])
                        .then(function (addAnswer) {
                            connection.query(
                                'INSERT INTO employee SET ?',
                                {
                                    first_name: addAnswer.first,
                                    last_name: addAnswer.last,
                                }
                            )
                            questions();
                        })
                })
        })
}

function viewAll() {
    connection.query('SELECT * FROM departments INNER JOIN employee ON role_id = departments.id inner join role on department_id = employee.id;', function (err, res) {
        if (err) throw err;
        console.table(res)
        questions();
    });
}

function viewAllEmployees() {
    connection.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        console.table(res)
        questions();
    });
};

function viewAllDepartments() {
    connection.query('SELECT * FROM departments', function (err, res) {
        if (err) throw err;
        console.table(res)
        questions();
    });
};

function viewAllRoles() {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        console.table(res)
        questions();
    });
};

function fired() {
    inquirer
        .prompt([
            {
                name: 'fired',
                type: 'input',
                message: 'What is the last name of the employee who was terminated?'
            }
        ])
        .then(function (terminated) {
            connection.query('SELECT role_id FROM employee WHERE last_name = ?',
                {
                    last_name: terminated.fired
                }
            )
            console.log(terminated)
        })
}