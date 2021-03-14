const pool = require('./pool');
const query = {}
query.getIngredientsByProductId = (id, res) => {
    
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT id, name from products WHERE id = $1', [id],(err, result) => {
          done();
          if (err) {
            console.log(err.stack)
          } else {
            var product = result.rows[0];
            if (product){
                const stmt = 
                'SELECT ing.name "ingredient", pi.quantity "quantity", '+ 
                'CASE WHEN pi.quantity > 1.0 THEN u.name_plural ELSE u.name_single END "uom" '+
                'FROM products p '+ 
                'JOIN products_ingredients pi ON p.id = pi.product_id '+ 
                'JOIN ingredients ing ON ing.id = pi.ingredient_id '+ 
                'JOIN uom u ON u.id = pi.uom_id '+
                'WHERE p.id = $1';
                pool.connect((err, client, done) => {
                    if (err) throw err
                    client.query(stmt, [id],(err, result) => {
                    done();
                    if (err) {
                        console.log(err.stack)
                    } else {
                        product['ingredients'] = result.rows;
                        res.json(product);
                    }
                    })
                });
            }
            else{
                res.json({ 'message': 'product does not exist'}); 
            }
              
          }
        })
    })
}

query.searchProductsByName = (nameString, res) =>{
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT id, name from products WHERE name LIKE $1::text', [`%${nameString}%`],(err, result) => {
          done();
          if (err) {
            console.log(err.stack)
          } else {
            var product = {}
            product.query = nameString;
            product.results = result.rows;  
            res.json(product);
          }
        })
    })
}

query.searchIngredientsByName = (nameString, res) =>{
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT id, name from ingredients WHERE name LIKE $1::text', [`%${nameString}%`],(err, result) => {
          done();
          if (err) {
            console.log(err.stack)
          } else {
            var product = {}
            product.query = nameString;
            product.results = result.rows;  
            res.json(product);
          }
        })
    })
}

module.exports = query;
