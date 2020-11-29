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
        })
}
// function to add a new employee to the database, gathers the information for all colums of all tables and adds the data to the corresponding areas
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
                'INSERT INTO departments SET ?;',
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
                    },
                    {
                        name: 'roleId',
                        type: 'input',
                        message: "What is this employee's role id number?",
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            console.log('ID must be a number.');
                            return false;
                        }
                    }
                ])
                .then(function (roleAnswer) {
                    connection.query(
                        'INSERT INTO role SET ?;',
                        {
                            title: roleAnswer.roleTitle,
                            salary: roleAnswer.salary,
                            department_id: roleAnswer.roleId
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
                            },
                            {
                                name: 'employeeId',
                                type: 'input',
                                message: "What is this employee's employee id number? (Will be the same as role id)",
                                validate: function (value) {
                                    if (isNaN(value) === false) {
                                        return true;
                                    }
                                    console.log('ID must be a number.');
                                    return false;
                                }
                            }
                        ])
                        .then(function (addAnswer) {
                            connection.query(
                                'INSERT INTO employee SET ?',
                                {
                                    first_name: addAnswer.first,
                                    last_name: addAnswer.last,
                                    role_id: addAnswer.employeeId
                                }
                            )
                            questions();
                        })
                })
        })
}
// function to view all tables and data within those tables for each employee
function viewAll() {
    connection.query('SELECT * FROM departments INNER JOIN employee ON role_id = departments.id inner join role on department_id = employee.id;', function (err, res) {
        if (err) throw err;
        console.table(res)
        questions();
    });
}
// function to view only employees
function viewAllEmployees() {
    connection.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        console.table(res)
        questions();
    });
};
// function to view only departments
function viewAllDepartments() {
    connection.query('SELECT * FROM departments', function (err, res) {
        if (err) throw err;
        console.table(res)
        questions();
    });
};
// function to view only roles
function viewAllRoles() {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        console.table(res)
        questions();
    });
};
// function that prompts the user for all the tables data to delete an employee and all info associated with that person
function fired() {
    inquirer
        .prompt([
            {
                name: 'firedName',
                type: 'input',
                message: 'What is the last name of the employee who was terminated?'
            }
        ])
        .then(function (terminatedName) {
            connection.query('DELETE FROM employee WHERE ?;',
                {
                    last_name: terminatedName.firedName
                }
            )
            inquirer
                .prompt([
                    {
                        name: 'firedDepartment',
                        type: 'input',
                        message: 'What department did this employee work in?'
                    }
                ])
                .then(function (terminatedDepartment) {
                    connection.query('DELETE FROM departments WHERE ?',
                        {
                            department: terminatedDepartment.firedDepartment
                        }
                    )
                    inquirer
                        .prompt([
                            {
                                name: 'firedRole',
                                type: 'input',
                                message: 'What role did what this employee?'
                            }
                        ])
                        .then(function (terminatedRole) {
                            connection.query('DELETE FROM role WHERE ?',
                                {
                                    title: terminatedRole.firedRole
                                }
                            )
                            console.log('Employee successfully terminated!')
                            questions();
                        });
                });
        });
};
// function to prompt user for an id for an employee to update either there current department or current role
function updateEmployee() {
    inquirer
        .prompt([
            {
                name: 'roleOrDep',
                type: 'list',
                message: 'Would you like to update employees role or deparment?',
                choices: ['Role', 'Department']
            }
        ])
        .then(function (roleOrDepAnswer) {
            if (roleOrDepAnswer.roleOrDep === 'Role') {
                inquirer
                    .prompt([
                        {
                            name: 'roleId',
                            type: 'input',
                            message: 'What is the ID number for the employee who is being updated?'
                        },
                        {
                            name: 'newRole',
                            type: 'input',
                            message: 'What is the new role for this employee?'
                        }
                    ])
                    .then(function (newRoleAnswer) {
                        connection.query('UPDATE role SET ? WHERE ?;',
                            [
                                {
                                    title: newRoleAnswer.newRole
                                },
                                {
                                    department_id: newRoleAnswer.roleId
                                }
                            ],
                            function (err) {
                                if (err) throw err;
                                questions();
                            }
                        )
                    })
            } else {
                inquirer
                    .prompt([
                        {
                            name: 'depId',
                            type: 'input',
                            message: 'What is the ID number for the employee who is being updated?'
                        },
                        {
                            name: 'newDep',
                            type: 'input',
                            message: 'What is the new department for this employee?'
                        }
                    ])
                    .then(function (newDepAnswer) {
                        connection.query('UPDATE departments SET ? WHERE ?;',
                            [
                                {
                                    department: newDepAnswer.newDep
                                },
                                {
                                    id: newDepAnswer.depId
                                }
                            ],
                            function (err) {
                                if (err) throw err;
                                questions();
                            }
                        )
                    })
            }
        })
};