/**
 *  Amai Bakery SQL statements
 *
 *  App to verify nutritional value and cost
 */

/**
 * DATABASE AND TABLE CREATION
 */

CREATE DATABASE amai_bakery;

drop table if exists unit_cost;
drop table if exists products_ingredients;
drop table if exists products_categories;
drop table if exists products;
drop table if exists ingredients;
drop table if exists categories;
drop table if exists uom;

-- Units of Measure table (UOM)

CREATE TABLE uom (
    id SERIAL PRIMARY KEY,
    abbr varchar(255) NOT NULL,
    name_single varchar(255) NOT NULL,
    name_plural varchar(255) NOT NULL,
    created_on timestamp NOT NULL default NOW(),
    modified_on timestamp NOT NULL default NOW() 
);

-- Ingredients table

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    description text NOT NULL,
    created_on timestamp NOT NULL default NOW(),
    modified_on timestamp NOT NULL default NOW() 
);

-- Categories table

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    description text NOT NULL,
    created_on timestamp NOT NULL default NOW(),
    modified_on timestamp NOT NULL default NOW() 
);

-- Products table

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    description text NOT NULL,
    created_on timestamp NOT NULL default NOW(),
    modified_on timestamp NOT NULL default NOW() 
);

-- Table to link products to categories

CREATE TABLE products_categories (
    id SERIAL PRIMARY KEY,
    product_id int references products(id),
    category_id int references categories(id)
);

-- Table to link products to ingredients

CREATE TABLE products_ingredients (
    id SERIAL PRIMARY KEY,
    product_id int references products(id),
    ingredient_id int references ingredients(id),
    uom_id int references UOM(id),
    quantity numeric NOT NULL
);

-- Unit cost table

CREATE TABLE unit_cost (
    id SERIAL PRIMARY KEY,
    ingredient_id int references ingredients(id),
    cost_usd_per_uom numeric NOT NULL,
    uom_id int references UOM(id),
    created_on timestamp NOT NULL default NOW(),
    modified_on timestamp NOT NULL default NOW() 
);

/**
 * STATEMENTS TO POPULATE DATABASE
 */

 -- UOM

 INSERT INTO uom (abbr, name_single, name_plural)
 VALUES 
 ('tsp', 'teaspoon', 'teaspoons'), ('tbsp','tablespoon', 'tablespoons'), 
 ('ea', '', ''), ('c', 'cup', 'cups'), 
 ('pinch', 'pinch', 'pinches'),
 ('g', 'gram', 'grams');

 -- ingredients

 INSERT INTO ingredients (name, description)
 VALUES
 ('unsalted butter', 'unsalted butter softened at room temperature'),
 ('granulated sugar', 'granulated sugar'),
 ('light brown sugar', 'light brown sugar'),
 ('egg', 'egg'),
 ('vanilla extract', 'vanilla extract'),
 ('all-purpose flour', 'all-purpose flour'),
 ('baking soda', 'baking soda'),
 ('salt', 'salt'),
 ('chocolate chips', 'chocolate chips');

 -- categories

 INSERT INTO categories (name, description)
 VALUES
 ('cookies', 'sweet cookies'),
 ('chocolate', 'products with chocolate'),
 ('sugar', 'recipes with sugar added');

-- products

INSERT INTO products (name, description)
VALUES
('chocolate chip cookies', 'chocolate chip cookies'),
('pecan pie cheesecake', 'pecan pie cheesecake'),
('tamagoyaki', 'tamagoyaki');

-- products_categories

INSERT INTO products_categories (product_id, category_id)
VALUES
(
    (SELECT id from products WHERE name = 'chocolate chip cookies'), 
    (SELECT id from categories WHERE name = 'chocolate')
), 
(
    (SELECT id from products WHERE name = 'chocolate chip cookies'), 
    (SELECT id from categories WHERE name = 'cookies')
),
(
    (SELECT id from products WHERE name = 'chocolate chip cookies'), 
    (SELECT id from categories WHERE name = 'sugar')
);

-- products_ingredients

INSERT INTO products_ingredients (product_id, ingredient_id, uom_id, quantity)
VALUES 
(
    (SELECT id from products WHERE name = 'chocolate chip cookies'),
    (SELECT id from ingredients WHERE name = 'unsalted butter'),
    (SELECT id from uom WHERE name_single = 'tablespoon' ),
    14.0
),
(
    (SELECT id from products WHERE name = 'chocolate chip cookies'),
    (SELECT id from ingredients WHERE name = 'granulated sugar'),
    (SELECT id from uom WHERE name_single = 'cup' ),
    1.0
);

-- unit_cost

INSERT INTO unit_cost (ingredient_id, cost_usd_per_uom, uom_id)
VALUES
(
    (SELECT id from ingredients WHERE name = 'unsalted butter'),
    0.03,
    (SELECT id from uom WHERE name_single = 'tablespoon' )
),
(
    (SELECT id from ingredients WHERE name = 'granulated sugar'),
    0.21,
    (SELECT id from uom WHERE name_single = 'cup' )
);

-- queries

-- /api/product/:id

/* PRODUCTS
SELECT id, name from product;
*/

/* INGREDIENTS
SELECT ing.name "ingredient", pi.quantity "quantity", 
CASE WHEN pi.quantity > 1.0 THEN u.name_plural ELSE u.name_single END "uom"
FROM products p 
JOIN products_ingredients pi ON p.id = pi.product_id 
JOIN ingredients ing ON ing.id = pi.ingredient_id 
JOIN uom u ON u.id = pi.uom_id
WHERE p.id = 1;
*/

/* COMPLETE
SELECT ing.name "ingredient", pi.quantity "quantity", 
CASE WHEN pi.quantity > 1.0 THEN u.name_plural ELSE u.name_single END "uom"
FROM products p 
JOIN products_ingredients pi ON p.id = pi.product_id 
JOIN ingredients ing ON ing.id = pi.ingredient_id 
JOIN uom u ON u.id = pi.uom_id
WHERE p.id = 1;
*/
