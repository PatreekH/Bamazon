var mysql = require('mysql');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'newave',
  database: 'Bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	displayOptions();
});

function displayOptions(){
	inquirer.prompt([
	{
		type: "list",
		message: "What would you like to do?",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
		name: "choice"
	}
	]).then(function (answers) {
  		switch(answers.choice){
    		case 'View Products for Sale':
      			viewProducts();
      		break;
    		case 'View Low Inventory':
      			viewLowInvo();
      		break;
    		case 'Add to Inventory':
      			add2Invo();
      		break;
      		case 'Add New Product':
      			addNewProduct();
      		break;
  		}
	});
}