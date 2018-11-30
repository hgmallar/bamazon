var inquirer = require("inquirer");
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

//function to ask the Manager what they would like to do
function menu() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "command",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "QUIT"]
        }
    ]).then(function (inquirerResponse) {
        if (inquirerResponse.command === "View Products for Sale") {
            viewProducts();
        }
        else if (inquirerResponse.command === "View Low Inventory") {
            viewLowInventory();
        }
        else if (inquirerResponse.command === "Add to Inventory") {
            addToInventory();
        }
        else if (inquirerResponse.command === "Add New Product") {
            addNewProduct();
        }
        else if (inquirerResponse.command === "QUIT") {
            quitMenu();
        }
    });
}

//function that prints all of the products in the products table in the bamazon database
function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) { throw err }
        else {
            console.log("---------------------------------");
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].item_id + " || Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
            }
            console.log("---------------------------------");
            //goes back to the menu when finished
            menu();
        }
    });
}

//function that prints all of the products in the products table in the bamazon database that have a quantity less than 5 
function viewLowInventory() {
    //queries the items in the database with a quantity less than 5
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) { throw err }
        else {
            console.log("---------------------------------");
            //prints all of the items
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].item_id + " || Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
            }
            console.log("---------------------------------");
            //goes back to the menu when finished
            menu();
        }
    });
}

//function that allows the Manager to add to the inventory
function addToInventory() {
    //asks what product name to add to and how much more to add
    inquirer.prompt([
        {
            type: "input",
            message: "What item would you like to add more of?",
            name: "productName"
        },
        {
            type: "input",
            message: "How many more would you like to add?",
            name: "quantity",
            //check that the quantity is a number
            validate: function (quantity) {
                if (/[^0-9]/.test(quantity)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        }
    ]).then(function (inquirerResponse) {
        //queries the products with the correct product name
        connection.query("SELECT * FROM products WHERE ? ", { product_name: inquirerResponse.productName }, function (err, res) {
            if (err) { throw err }
            else {
                //add the new quantity to the existing quantity to get the new quantity
                var newQuantity = parseInt(res[0].stock_quantity) + parseInt(inquirerResponse.quantity);
                connection.query(
                    //updates the new quantity in the database 
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newQuantity
                        },
                        {
                            product_name: inquirerResponse.productName
                        }
                    ],
                    function (err, result) {
                        console.log(result.affectedRows + " products updated!\n");
                        //goes back to the menu when finished
                        menu();
                    }
                )
            }
        });
    });
}

//function to add a new product to the database
function addNewProduct() {
    //asks what product name to add to the database, what the department is, what the price is, and what the quantity is
    inquirer.prompt([
        {
            type: "input",
            message: "What item would you like to add?",
            name: "productName"
        },
        {
            type: "input",
            message: "What is the department?",
            name: "departmentName"
        },
        {
            type: "input",
            message: "What is the price?",
            name: "price",
            //check that the price is a number
            validate: function (price) {
                if (/[^0-9.]/.test(price)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "What is the quantity?",
            name: "quantity",
            //check that the quantity is a number
            validate: function (quantity) {
                if (/[^0-9]/.test(quantity)) {
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
            "INSERT INTO products SET ?",
            {
                product_name: inquirerResponse.productName,
                department_name: inquirerResponse.departmentName,
                price: inquirerResponse.price,
                stock_quantity: inquirerResponse.quantity
            },
            function (err, result) {
                console.log(result.affectedRows + " product inserted!\n");
                //goes back to the menu when finished
                menu();
            }
        );
    });
}

function quitMenu() {
    //end the connection
    connection.end();
}

//start the menu
menu();