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
	console.log(" ");
	inquirer.prompt([
	{
		type: "list",
		message: "What would you like to do?",
		choices: ["1) View Products Sales by Department", "2) Create New Department"],
		name: "choice"
	}
	]).then(function (answers) {
  		switch(answers.choice){
    		case '1) View Products Sales by Department':
      			viewProductsSales();
      		break;
    		case '2) Create New Department':
      			createNewDepartment();
      		break;
      		//Add quit option
  		}
	});
}

function viewProductsSales() {
	connection.query('SELECT * FROM `Departments`', function(err, rows, fields){ 
		if (err) throw err;
		console.log(" ");
		//console.log(rows);
		for (i = 0; i < rows.length; i++){
			var totalProfit = rows[i].TotalSales - rows[i].OverHeadCosts;
			console.log("===============================");
			console.log("| Department Id: " + rows[i].DepartmentID);
			console.log("| Department Name: " + rows[i].DepartmentName);
			console.log("| OverHead Costs: $" + rows[i].OverHeadCosts);
			console.log("| Total Sales: $" + rows[i].TotalSales);
			console.log("| Total Profit: $" + totalProfit);
			console.log("===============================");
		}
		displayOptions();
	});
}

function createNewDepartment(){
 	console.log(" ");
	var departmentName = {
		properties: {
			name: {
				description: "Please enter the name of the new Department"
			}
		}
	};
	var ohCost = {
		properties: {
			overHead: {
				description: "Please enter the overhead cost of the new Department"
			}
		}
	};
	prompt.start();
	prompt.get([departmentName, ohCost], function(err, data){
		var currSales = 0;
			//console.log(data.id, data.quantity);
		connection.query('INSERT INTO `Departments` SET DepartmentName = ?, OverHeadCosts = ?, TotalSales = ?', [data.name, data.overHead, currSales], function(err, rows, fields) {
 			if (err) throw err;
 			console.log(" ");
 			console.log("Department successfully added!");
 			displayOptions();
 		});
	});
}