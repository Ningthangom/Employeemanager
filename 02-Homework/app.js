var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable  = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Ning_thang_om_96",
  database: "employee_tracker_v2_db"
});



// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });

  function start() {
    inquirer
      .prompt({
        name: "todo",
        type: "list",
        message: "Would you like to [add] an employee, [view] employees or update their details?",
        choices: ["add", "view", "update", "EXIT"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.todo === "add") {
          addnewthing();
        }
        else if(answer.todo === "update") {
            updateEmployee();
        }else if (answer.todo === "view") {
            view();
        } else{
          connection.end();
        }
      });
  }


  // adding things 
  function addnewthing() {
    inquirer
      .prompt({
        name: "todo",
        type: "list",
        message: "Would you like to [add] new department, role or employee?",
        choices: ["department", "role", "employee", "EXIT"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.todo === "department") {
          addnewDepartment();
        }
        else if(answer.todo === "role") {
          addnewRole ();
        }else if (answer.todo === "employee") {
            addnewEmployee()
        } else{
            start();
        }
      });
  }

  // adding new department
function addnewDepartment () {
    inquirer
    .prompt([
   
        {
          name: "department",
          type: "input",
          message: "enter departmet: "
      }
    ])
    .then(function(answer) {
        connection.query( 
            "INSERT INTO department SET ?",
            {
              name: answer.department
            },
            function(err) {
              if (err) throw err;
              console.log("adding new department was successfully!");
              // re-prompt the user for if they want to add, view or update
              start();
            }
          );
    })
}



// add new role
function addnewRole () {
    inquirer
    .prompt([
        {
            name: "role",
            type: "input",
            message: "the name of new role: "
        },
        {
          name: "departmentId",
          type: "number",
          message: "enter department id: "
      },
        {
            name: "salary",
            type: "input",
            message: "The salary for this new role: "
        }

    ])
    .then(function(answer) {
        connection.query( 
            "INSERT INTO role SET ?",
            {
              title: answer.role,
              salary: answer.salary,
              department_id: answer.departmentId
            },
            function(err) {
              if (err) throw err;
              console.log("adding new role was successfully!");
              // re-prompt the user for if they want to add, view or update
             start();
            }
          );
    })
} 

function addnewEmployee() {
    // prompt for info about the item being put up for auction
    console.log("make sure that you know the department id and role id from that department before you add new employee.");
    inquirer
      .prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is your first name? "
        },
        {
          name: "last_name",
          type: "input", 
          message: "What is your last name? "
        },
        {
          name: "roleid",
          type: "input", 
          message: "What is your role id in your department? "
        },
        {
          name: "departmentid",
          type: "input", 
          message: "What is your department id in your department? "
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new employee into the db with that info
        connection.query( 
          "INSERT INTO employee SET ?",
          {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.roleid,
            department_id: answer.departmentid
          },
          function(err) {
            if (err) throw err;
            console.log("adding new employee was successfully!");
            // re-prompt the user for if they want to add, view or update
            start();
          }
        );
      });
  
  }

// viewing things

function view() {
    inquirer
      .prompt({
        name: "view",
        type: "list",
        message: "What would you like to view today? [use arrow key] ",
        choices: ["departments", "roles", "employees", "EXIT"]
      })
      .then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.view === "departments") {
          viewDepartment();
        }
        else if(answer.view === "roles") {
          viewroles ();
        }else if (answer.view === "employees") {
            viewEmployee();
        } else{
          connection.end();
        }
      });
  }

// view department 
function viewDepartment(){
    console.log("selection table from the database")
    connection.query("SELECT * FROM department", function(err,data) {
      if (err) throw err;
      
      console.table(data);
      console.log("made this view work today");
     start();
      
      return data;
    });
}

// view roles 
function viewroles(){
    console.log("selection table from the database")
    connection.query("SELECT * FROM role", function(err,data) {
      if (err) throw err;
      
      console.table(data);
      console.log("made this view work today")
    start();
      
      return data;
    });
  }

//view employee table
function viewEmployee(){
    console.log("selection table from the database")
    connection.query("SELECT * FROM employee", function(err,data) {
      if (err) throw err;
      
      console.table(data);
      console.log("made this view work today")
    start();
      
      return data;
    });
}

//update employee detail
function updateEmployee() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM employee", function(err, results) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].first_name);
              }
              return choiceArray;
            },
            message: "whom would you want to update?"
          },
          {
            name: "updateDetail",
            type: "list",
            message: "What would you like to change?",
           choices: ["First Name", "last name", "Role", "EXIT"] 
          }  
        ])
        .then(function(answer) {
          // based on their answer, either call the bid or the post functions
          if (answer.updateDetail === "First Name") {
            updatefirstName();
          }
          else if(answer.updateDetail === "last name") {
            updatelastName();
          }else if (answer.updateDetail === "Role") {
              updateRole()
          }
          else {
            start();
          }
        });
    });
  }

// update first name

function updatefirstName() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM employee", function(err, results) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].first_name);
              }
              return choiceArray;
            },
            message: "Confirm the one that you want to change: "
          },
          {
            name: "firstName",
            type: "input",
            message: "first name : "
          }
        ])
        .then(function(answer) {
          // get the information of the chosen item
          var chosenItem;
          for (var i = 0; i < results.length; i++) {
            if (results[i].first_name === answer.choice) {
              chosenItem = results[i];
            }
          }
  
          // determine if bid was high enough
            // bid was high enough, so update db, let the user know, and start over
            connection.query(
              "UPDATE employee SET ? WHERE ?",
              [
                {
                    first_name: answer.firstName
                },
                {
                  id: chosenItem.id
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("first name updated!");
                start();
              }
            );
        });
    });
  }


  //update last name 
  
function updatelastName() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM employee", function(err, results) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].last_name);
              }
              return choiceArray;
            },
            message: "Confirm the last name that you want to change: "
          },
          {
            name: "lastName",
            type: "input",
            message: "Last name : "
          }
        ])
        .then(function(answer) {
          // get the information of the chosen item
          var chosenItem;
          for (var i = 0; i < results.length; i++) {
            if (results[i].last_name === answer.choice) {
              chosenItem = results[i];
            }
          }
  
          // determine if bid was high enough
            // bid was high enough, so update db, let the user know, and start over
            connection.query(
              "UPDATE employee SET ? WHERE ?",
              [
                {
                    last_name: answer.lastName
                },
                {
                  id: chosenItem.id
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("Last name updated!");
                start();
              }
            );
        });
    });
  }

    //update role
  
function updateRole() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM employee", function(err, results) {
      if (err) throw err;
      // once you have the items, prompt the user for which they'd like to bid on
      inquirer
        .prompt([
          {
            name: "choice",
            type: "rawlist",
            choices: function() {
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push(results[i].first_name);
              }
              return choiceArray;
            },
            message: "Confirm the one that you want to change: "
          },
          {
            name: "roleid",
            type: "number",
            message: "role id : "
          }
        ])
        .then(function(answer) {
          // get the information of the chosen item
          var chosenItem;
          for (var i = 0; i < results.length; i++) {
            if (results[i].first_name === answer.choice) {
              chosenItem = results[i];
            }
          }
  
          // determine if bid was high enough
            // bid was high enough, so update db, let the user know, and start over
            connection.query(
              "UPDATE employee SET ? WHERE ?",
              [
                {
                    role_id: answer.roleid
                },
                {
                  id: chosenItem.id
                }
              ],
              function(error) {
                if (error) throw err;
                console.log("Role id updated!");
                start();
              }
            );
        });
    });
  }



