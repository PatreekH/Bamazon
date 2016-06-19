var mysql = require('mysql');
var inquirer = require('inquirer');
var prompt = require('prompt');
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
		choices: ["1) View Products for Sale", "2) View Low Inventory", "3) Add to Inventory", "4) Add New Product"],
		name: "choice"
	}
	]).then(function (answers) {
  		switch(answers.choice){
    		case '1) View Products for Sale':
      			viewProducts();
      		break;
    		case '2) View Low Inventory':
      			viewLowInvo();
      		break;
    		case '3) Add to Inventory':
      			add2Invo();
      		break;
      		case '4) Add New Product':
      			addNewProduct();
      		break;
  		}
	});
}

function viewProducts() {
	connection.query('SELECT * FROM `Products`', function(err, rows, fields) {
 		if (err) throw err;
 		console.log(" ");
 		console.log("==== Products Available for Sale: ====");
 		for (i = 0; i < rows.length; i++){
 			console.log(" ");
 			console.log("========== ItemID: " + rows[i].ItemID + " ==========");
 			console.log("| Name: " + rows[i].ProductName);
 			console.log("| Department: " + rows[i].DepartmentName);
 			console.log("| Price: $" + rows[i].Price);
 			console.log("| Left in Stock: " + rows[i].StockQuantity);
 			if (rows[i].ItemID >= 10){
 				console.log("================================")
 				console.log(" ");
 			} else {
 				console.log("===============================");
 			}
 		}
 		displayOptions();
 	});
}

function viewLowInvo() {
	connection.query('SELECT * FROM `products` WHERE `StockQuantity` <= 5', function(err, rows, fields) {
 		if (err) throw err;
 		console.log(" ");
 		console.log("==== Products with Low Inventory: ====");
 		console.log(" ");
 		for (i = 0; i < rows.length; i++){
 			console.log("========== ID Number: " + rows[i].ItemID + " ==========");
 			console.log("| Item Name: " + rows[i].ProductName);
 			console.log("| Department: " + rows[i].DepartmentName);
 			console.log("| Price: $" + rows[i].Price);
 			console.log("| Left in Stock: " + rows[i].StockQuantity);
 			if (rows[i].ItemID >= 10){
 				console.log("===================================");
 				console.log(" ");
 			} else {
 				console.log("==================================");
 				console.log(" ");
 			}
 		}
 		displayOptions();
 	});
}

function add2Invo() {
 		console.log(" ");
		var itemId = {
			properties: {
				id: {
					description: "Please enter the ID of the product you would like to edit"
				}
			}
		};
		var quantity = {
			properties: {
				quantity: {
					description: "Please enter the quantity you would like to add"
				}
			}
		};
		prompt.start();
		prompt.get([itemId, quantity], function(err, data){
			//console.log(data.id, data.quantity);
			connection.query('SELECT * FROM `Products` WHERE `ItemID` = "' + data.id + '"' , function(err, rows, fields) {
 				if (err) throw err;
 				for (i = 0; i < rows.length; i++){
 					var newQuantity = rows[i].StockQuantity += parseInt(data.quantity);
 					updateStock(newQuantity, data.id);
 				}
 			});
		});
}

function updateStock(newQuantity, itemId) {
	connection.query('UPDATE `Products` SET `StockQuantity` = "' + newQuantity + '" WHERE `ItemID` = "' + itemId + '"', function(err, rows, fields) {
 		if (err) throw err;
 		console.log(" ");
 		console.log("Database successfully updated!");
 		console.log(" ");
		displayOptions();
 	});
}