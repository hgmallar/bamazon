var inquirer = require("inquirer");
const cTable = require('console.table');
let mysql = require("mysql");

let connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        user: 'root',
        password: 'get2Mysql!',
        database: 'bamazon'
    }
)

//function to create a new department in the department table in the bamazon database
function createNewDept() {
    //asks for the department name and overhead costs
    inquirer.prompt([
        {
            type: "input",
            message: "What department would you like to add?",
            name: "departmentName"
        },
        {
            type: "input",
            message: "What is the overhead costs of the department?",
            name: "deptCosts",
            //check that the costs is a number
            validate: function (deptCosts) {
                if (/[^0-9.]/.test(deptCosts)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    ]).then(function (inquirerResponse) {
        console.log("Inserting a new product...\n");
        //inserts the new item into the database
        var query = connection.query(

            "INSERT INTO departments SET ?",
            {
                department_name: inquirerResponse.departmentName,
                over_head_costs: inquirerResponse.deptCosts
            },
            function (err, result) {
                console.log(result.affectedRows + " department inserted!\n");
                connection.end();
            }
        );
    });
}

//a function to print out the product sales by department
function productSalesByDept() {
    var prevDeptID = -1;
    //get all of the items from the two table with the same department_name and order them by the department_id
    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.department_name, products.product_sales ";
    query += "FROM departments INNER JOIN products ON (departments.department_name = products.department_name) ";
    query += " ORDER BY departments.department_id ";

    connection.query(query, function (err, res) {
        if (err) { throw err }
        else {
            var table = [];
            //sort through each of the items returned
            for (var i = 0; i < res.length; i++) {
                //if the department ID is the same as the previous department id, go to the last item in the table and adjust the product sales and the total profit
                if (res[i].department_id === prevDeptID) {
                    table[table.length - 1].product_sales = (parseFloat(table[table.length - 1].product_sales) + parseFloat(res[i].product_sales)).toFixed(2);
                    table[table.length - 1].total_profit = (parseFloat(table[table.length - 1].total_profit) + parseFloat(res[i].product_sales)).toFixed(2);
                }
                //otherwise, this is a new department id, so add all of the information to the table to print
                //this is the place where the overhead costs get subtracted, so that it only happens once per department
                else {
                    var totalProfit = parseFloat(res[i].product_sales) - parseFloat(res[i].over_head_costs);
                    table.push({
                        department_id: res[i].department_id,
                        department_name: res[i].department_name,
                        over_head_costs: res[i].over_head_costs,
                        product_sales: res[i].product_sales,
                        total_profit: totalProfit
                    });
                }
                //keep track of the department id so it can be compared to the next item's department id
                prevDeptID = res[i].department_id;
            }
            //print the table
            console.table(table);
            connection.end();
        }
    });

}

function printProductsTable() {
    connection.query("select * from products", function (err, res) {
        if (err) { throw err }
        else {
            //print all of the items in the products table of the bamazon database
            console.log("----------------------------------");
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].item_id + " || Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity + " || Sales: " + res[i].product_sales);
            }
        }
    });
}

function printDeparmentsTable() {
    connection.query("select * from departments", function (err, res) {
        if (err) { throw err }
        else {
            //print all of the items in the departments table of the bamazon database
            console.log("----------------------------------");
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].department_id + " || Name: " + res[i].department_name + " || Costs: " + res[i].over_head_costs);
            }
            console.log("----------------------------------");
        }
    });
}

function menu() {
    //ask the user what they would like to do 
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "command",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function (inquirerResponse) {
        if (inquirerResponse.command === "View Product Sales by Department") {
            printProductsTable();
            printDeparmentsTable();
            productSalesByDept();
        }
        else if (inquirerResponse.command === "Create New Department") {
            createNewDept();
        }
    });
}

menu();

