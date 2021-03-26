const pool = require('./pool');
const edaman = require('./edaman');
const query = {}
query.getProductById = (id) => {
  return new Promise((resolve, reject)=>{
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('SELECT id, name, image from products WHERE id = $1', [id],(err, result) => {
        done();
        if (err) {
          reject(err.stack);
        } else {
          var product = result.rows[0];
          if (product){
              const stmt = 
              'SELECT ing.name "name", pi.quantity "quantity", '+ 
              'CASE WHEN pi.quantity > 1.0 THEN u.name_plural ELSE u.name_single END "uom", '+
              `pi.quantity || CASE WHEN abbr = 'ea' THEN ' ' ELSE CASE WHEN pi.quantity > 1.0 ` +
              `THEN ' ' || u.name_plural || ' ' ELSE `+
              `' ' || u.name_single || ' ' END END || ing.name "string" `+
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
                      reject(err.stack)
                  } else {
                      product['ingredients'] = result.rows;
                      resolve(product);
                  }
                  })
              });
          }
          else{
              resolve({ 'message': 'product does not exist'}); 
          }
            
        }
      })
  })
  })       
}


query.getLatestProducts = (number) => {    
  return new Promise((resolve, reject)=>{
    pool.connect((err, client, done) => {
      if (err) throw err
      client.query('SELECT id, name, image from products ORDER BY created_on DESC LIMIT $1', [number], async (err, result) => {
        done();
        if (err) {
          reject(err.stack);
        } else {
          var products = result.rows;
          if (products){
            const stmt = 
              'SELECT ing.name "name", pi.quantity "quantity", '+ 
              'CASE WHEN pi.quantity > 1.0 THEN u.name_plural ELSE u.name_single END "uom", '+
              `pi.quantity || CASE WHEN abbr = 'ea' THEN ' ' ELSE CASE WHEN pi.quantity > 1.0 ` +
              `THEN ' ' || u.name_plural || ' ' ELSE `+
              `' ' || u.name_single || ' ' END END || ing.name "string" `+
              'FROM products p '+ 
              'JOIN products_ingredients pi ON p.id = pi.product_id '+ 
              'JOIN ingredients ing ON ing.id = pi.ingredient_id '+ 
              'JOIN uom u ON u.id = pi.uom_id '+
              'WHERE p.id = $1';
           
             for(var i=0;i<products.length;i++){
              products[i]['ingredients'] = await new Promise((resolve, reject)=>{
                pool.connect((err, client, done) => {
                  if (err) throw err
                  client.query(stmt, [products[i].id],(err, res) => {
                    done();
                    if (err) {
                        reject(err.stack)
                    } else {
                        resolve(res.rows);
                        
                    }
                  })
                });
              });
             }
              resolve(products);   
          
          }
          else{
              resolve({ 'message': 'product does not exist'}); 
          }
            
        }
      })
  })
  })       
}


query.searchProductsByName = (nameString) =>{
  return new Promise((resolve, reject)=>{
      pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT id, name, image from products WHERE name LIKE $1::text', [`%${nameString}%`],(err, result) => {
          done();
          if (err) {
            reject(err.stack);
          } else {
            var product = {}
            product.query = nameString;
            product.results = result.rows;  
            resolve(product);
          }
        })
      })
  });   
}

query.searchIngredientsByName = (nameString) =>{
  return new Promise((resolve, reject)=>{
    pool.connect((err, client, done)=>{
      if(err) throw err
      client.query('SELECT id, name from ingredients WHERE name LIKE $1::text', [`%${nameString}%`],(err, result) => {
        done();
        if (err) {
          reject(err.stack);
        } else {
          var product = {}
          product.query = nameString;
          product.results = result.rows;  
          resolve(product);
        }
      })
    })
  })
}

query.getIngredientById = (id) =>{
  return new Promise((resolve, reject)=>{
    pool.connect((err, client, done)=>{
      if(err) throw err
      client.query('SELECT id, name from ingredients WHERE id = $1', [id],(err, result) => {
        done();
        if (err) {
          reject(err.stack);
        } else { 
          resolve(result.rows[0]);
        }
      })
    })
  })
}

// TODO
query.getNutrients = (ingredientArray, res, jsonElem)=>{
 edaman.query('2 lb of sugar', res);
}

module.exports = query;
