var mysql = require("mysql");
var inquirer = require("inquirer");

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

// function which prompts the user for what action they should take
function start() {
  inquirer
    .prompt({
      name: "postOrBid",
      type: "list",
      message: "Would you like to [POST] an auction or [BID] on an auction?",
      choices: ["add", "view", "update", "EXIT"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.postOrBid === "add") {
        addnewEmployee();
      }
      else if(answer.postOrBid === "update") {
        updateEmployee();
      } else{
        connection.end();
      }
    });
}

// function to handle posting new items up for auction
function addnewEmployee() {
  // prompt for info about the item being put up for auction
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
      }
/*       {
        name: "startingBid",
        type: "input",
        message: "What would you like your starting bid to be?",
     /*    validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        } *
      } 
 */
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query( 
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
         /*  starting_bid: answer.startingBid || 0,
          highest_bid: answer.startingBid || 0 */
        },
        function(err) {
          if (err) throw err;
          console.log("adding new employee was successfully!");
          // re-prompt the user for if they want to add, view or update
          addEmployeeToRole();
          /* start(); */ 
        }
      );
    });

  
}

function addEmployeeToRole () {
    inquirer
    .prompt([
        {
            name: "role",
            type: "input",
            message: "What is your role in this company? "
        },
        {
            name: "salary",
            type: "input",
            message: "What is your salary ? "
        }

    ])
    .then(function(answer) {
        connection.query( 
            "INSERT INTO role SET ?",
            {
              title: answer.role,
              salary: answer.salary,
             /*  starting_bid: answer.startingBid || 0,
              highest_bid: answer.startingBid || 0 */
            },
            function(err) {
              if (err) throw err;
              console.log("adding new employee was successfully!");
              // re-prompt the user for if they want to add, view or update
              addEmployeeToDepartment();
              /* start(); */
            }
          );
    })
}


function addEmployeeToDepartment () {
    inquirer
    .prompt([
        {
            name: "department",
            type: "input",
            message: "Which department are you apart of? "
        }
    ])
    .then(function(answer) {
        connection.query( 
            "INSERT INTO department SET ?",
            {
              name: answer.department,
             /*  starting_bid: answer.startingBid || 0,
              highest_bid: answer.startingBid || 0 */
            },
            function(err) {
              if (err) throw err;
              console.log("adding new employee was successfully!");
              // re-prompt the user for if they want to add, view or update
              start();
            }
          );
    })
}












function updateEmployee() {
  // query the database for all items being auctioned
  connection.query("SELECT * FROM auctions", function(err, results) {
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
              choiceArray.push(results[i].item_name);
            }
            return choiceArray;
          },
          message: "What auction would you like to place a bid in?"
        },
        {
          name: "bid",
          type: "input",
          message: "How much would you like to bid?"
        }
      ])
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        // determine if bid was high enough
        if (chosenItem.highest_bid < parseInt(answer.bid)) {
          // bid was high enough, so update db, let the user know, and start over
          connection.query(
            "UPDATE auctions SET ? WHERE ?",
            [
              {
                highest_bid: answer.bid
              },
              {
                id: chosenItem.id
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Bid placed successfully!");
              start();
            }
          );
        }
        else {
          // bid wasn't high enough, so apologize and start over
          console.log("Your bid was too low. Try again...");
          start();
        }
      });
  });
}