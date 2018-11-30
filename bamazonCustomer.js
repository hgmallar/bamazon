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

//function to check if the quantity is valid, and if so, allow the customer to purchase
function checkQuantity(itemId, itemQuantity) {
    //look up the item id in the database and grab the price and quantity
    var query = "SELECT price, stock_quantity, product_sales FROM products WHERE ?";
    connection.query(query, { item_id: itemId }, function (err, res) {
        //if the database quantity is less than the quantity to purchase
        if (res[0].stock_quantity < itemQuantity) {
            //not enough quantity
            console.log("Insufficient quantity!");
            connection.end();
        }
        //if the database quantity is more than or equal to the quantity to purchase
        else {
            //fulfill the order
            var newQuantity = res[0].stock_quantity - itemQuantity;
            var total = res[0].price * itemQuantity;
            //round to two decimal places
            total = total.toFixed(2);
            if (res[0].product_sales) {
                var newSales = parseFloat(res[0].product_sales) + parseFloat(total);
            }
            else {
            var newSales = total;
            }
            //update the database with the new quantity
            var nextQuery = "UPDATE products SET ? WHERE ?";
            connection.query(nextQuery, [{stock_quantity: newQuantity, product_sales: newSales}, {item_id: itemId}], function (err, result) {
                //show the total cost of the purchase using the price from the database
                console.log("The total cost is $" + total);
                connection.end();
            });
        }
    });

}

//connect to the database
connection.connect(function (err) {
    if (err) throw err
    connection.query("select * from products", function (err, res) {
        if (err) { throw err }
        else {
            //print all of the items in the products table of the bamazon database
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].item_id + " || Name: " + res[i].product_name + " || Department: " + res[i].department_name + " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
            }
            //ask the customer what they what id they would like to buy and how much
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the ID of the item that you would like to buy?",
                    name: "buyID",
                    //check that the id is a number, and exists in the database
                    validate: function (buyID) {
                        if ((/\D/.test(buyID)) || (parseInt(buyID) <= 0) || (parseInt(buyID) > res.length)) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                },
                {
                    type: "input",
                    message: "What is the quantity of the item that you would like to buy?",
                    name: "buyQuantity",
                    //check that the quantity is a number
                    validate: function (buyQuantity) {
                        if (/[^0-9]/.test(buyQuantity)) {
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                }
            ]).then(function (inquirerResponse) {
                //check the quantity and pursue transaction, if possible
                checkQuantity(inquirerResponse.buyID, inquirerResponse.buyQuantity);
            });
        }
    });
})