DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(10, 4) NOT NULL,
  PRIMARY KEY (department_id)
);

INSERT INTO departments(department_name, over_head_costs)
VALUES ("household", 1000), ("toys", 1043), ("technology", 2300), ("clothing", 876), ("cooking", 899), ("outdoors", 754), ("grocery", 8023);;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10, 4) NOT NULL,
  stock_quantity INTEGER(100),
  PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("paper towels", "household", 12.97, 2000), ("legos", "toys", 39.99, 43), ("tablet", "technology", 99.99, 23), ("sneakers", "clothing", 59.99, 76), ("pajamas", "clothing", 19.99, 457), ("LOL surprise", "toys", 19.98, 2349), ("insta pot", "cooking", 59.99, 342), ("blender", "cooking", 19.97, 39), ("belt", "clothing", 9.98, 23), ("umbrella", "outdoors", 7.90, 54);

ALTER TABLE products
ADD COLUMN product_sales VARCHAR(15) AFTER stock_quantity;

SELECT * FROM products;
