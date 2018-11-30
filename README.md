# bamazon

## bamazonCustomer Demo
![Video Demonstration Here](/videos/customer.gif)

* The items available for purchase are displayed.
* The customer is asked the ID of the product they would like to buy.
* Then they are asked how many units of the product they would like to buy.
* Once the customer has placed the order, the application checks if the store has enough of the product to meet the customer's request.
    * If not, the app says `Insufficient quantity!`, and then prevents the order from going through.
    * If the store does have enough of the product, the SQL database is updated to reflect the remaining quantity and the product sales.  The customer is shown the total cost of their purchase.

## bamazonManager Demo
![Video Demonstration Here](/videos/manager.gif)

* The Manager can choose from the following:
    * View Products for Sale
    * View Low Inventory
    * Add to Inventory    
    * Add New Product
  * If a manager selects `View Products for Sale`, the app will list every available item: the item IDs, names, prices, and quantities.
  * If a manager selects `View Low Inventory`, then it will list all items with an inventory count lower than five.
  * If a manager selects `Add to Inventory`, the app will display a prompt that will let the manager "add more" of any item currently in the store.  The manager can type in the product name and the additional quantity to add.
  * If a manager selects `Add New Product`, it allows the manager to add a completely new product to the store, entering the product name, department, price, and quantity.

## bamazonSupervisor Demo
![Video Demonstration Here](/videos/supervisor.gif)

* The supervisor can choose from the following set of menu options:
   * View Product Sales by Department
   * Create New Department
* When a supervisor selects `View Product Sales by Department`, the app displays the products table, the departments table and a summarized table of total profit by department.
* The supervisor can also create new departments in the departments table by entering a department name and the amount of overhead costs for that department.

# Results: 
* Requires **inquirer** and **mysql** packages.
* Uses **SQL** database tables.




