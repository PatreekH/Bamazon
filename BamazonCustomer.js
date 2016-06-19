var prompt = require('prompt');
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'newave',
  database: 'Bamazon'
});

connection.connect(function(err) {
	if (err) throw err;
	displayItems();
});

function displayItems() {
	connection.query('SELECT * FROM `Products`', function(err, rows, fields) {
 		if (err) throw err;
 		console.log(" ");
 		console.log("==== Products Available: ====");
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
 		buyProduct();
 	});
}

function buyProduct(){
	var item = {
		properties: {
			id: {
				description: "Please enter the ID of the product you would like to purchase"
			}
		}
	};
	var quantity = {
		properties: {
			quantity: {
				description: "Please enter the quantity you would like to buy"
			}
		}
	};
	prompt.start();
		prompt.get([item, quantity], function(err, data){
			makePurchase(data.id, data.quantity);
		})
};

function makePurchase(itemId, quantity){
	connection.query('SELECT * FROM `Products` WHERE `ItemID` = "' + itemId + '"' , function(err, rows, fields) {
 		if (err) throw err;
 		//Your new total is: Does this look correct?
 		//If yes run for loop, if no run buyProduct again
 		for (i = 0; i < rows.length; i++){
 			if (quantity > rows[i].StockQuantity){
 				console.log(" ");
 				console.log("Insufficient quantity! Please try again!");
 				console.log(" ");
 				buyProduct();
 			} else {
 				console.log(" ");
 				console.log("Success! The sale has been finalized.");
 				console.log("Here is your receipt: ");
 				console.log("-----------------------------");
 				console.log("| ");
 				console.log("| Name: " + rows[i].ProductName);
 				console.log("| ");
 				console.log("| Quantity Selected: " + quantity);
 				console.log("| ");
 				console.log("| Price per item: $" + rows[i].Price);
 				console.log("| ");
 				console.log("| Total: $" + rows[i].Price * quantity);
 				console.log("| ");
 				console.log("-----------------------------");
 				console.log("Thank you for shopping with Bamazon!");
 				console.log(" ");
 				updateStock(itemId, quantity);
 			}
 		}
 	});
}

function updateStock(itemId, quantityPurchased) {
	connection.query('SELECT * FROM `Products` WHERE `ItemID` = "' + itemId + '"' , function(err, rows, fields) {
 		if (err) throw err;
 		for (i = 0; i < rows.length; i++){
 			var newQuantity = rows[i].StockQuantity -= quantityPurchased;
 			updateDB(itemId, newQuantity)
 		}
 	});
}

function updateDB(itemId, newQuantity){
	connection.query('UPDATE `Products` SET `StockQuantity` = "' + newQuantity + '" WHERE `ItemID` = "' + itemId + '"', function(err, rows, fields) {
 		if (err) throw err;
 		//Would you like to keep shopping?
 		//If yes run displayItems, if no console log "Come back soon!" & connection.end
 		connection.end();
 	});
}