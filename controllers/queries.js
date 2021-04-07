const pool = require('./pool');
const query = {}

query.psqlQuery = (stmt, elems) =>{
  return new Promise((resolve, reject)=>{
    pool.connect((err, client, done)=>{
      if(err) throw err;
      client.query(stmt, elems, (err, result)=>{
        done();
        if (err){
          reject(err.stack);
        }
        else{
          resolve(result);
        }
      });
    });
  });
}

query.userIdExists = (userID) =>{
  return new Promise((resolve, reject)=>{
    try{
      query.psqlQuery('SELECT username FROM users WHERE id = $1', [userID])
      .then(result=>{
        if(result.rowCount != 0){
          resolve(true);
        }
        else{
          resolve(false);
        }
      });
    }
    catch(err){
      reject(err);
    }
  })
  
}

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
              'SELECT pi.id "pi_id", ing.name "name", pi.quantity "quantity", '+ 
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
              'SELECT pi.id "pi_id", ing.name "name", pi.quantity "quantity", '+ 
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
      client.query('SELECT id, name, description from ingredients WHERE name LIKE $1::text', [`%${nameString}%`],(err, result) => {
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
      client.query('SELECT id, name, description from ingredients WHERE id = $1', [id],(err, result) => {
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

query.getIngredients = () =>{
  return new Promise((resolve, reject)=>{
    pool.connect((err, client, done)=>{
      if(err) throw err
      client.query('SELECT id, name, description from ingredients', [],(err, result) => {
        done();
        if (err) {
          reject(err.stack);
        } else {
          var product = {}
          product.results = result.rows;  
          resolve(product);
        }
      })
    })
  })
}

query.getUOMs = () =>{
  return new Promise((resolve, reject)=>{
    pool.connect((err, client, done)=>{
      if(err) throw err
      client.query('SELECT id, abbr, name_single, name_plural from uom', [],(err, result) => {
        done();
        if (err) {
          reject(err.stack);
        } else {
          var product = {}
          product = result.rows;  
          resolve(product);
        }
      })
    })
  })
}

query.getUOMById = (id) =>{
  return new Promise((resolve, reject)=>{
    pool.connect((err, client, done)=>{
      if(err) throw err
      client.query('SELECT id, abbr, name_single, name_plural from uom WHERE id = $1', [id],(err, result) => {
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

query.deleteIngredient = (id)=>{
  return new Promise((resolve, reject)=>{
    query.psqlQuery('DELETE FROM products_ingredients WHERE ingredient_id = $1', [id])
    .then((result1)=>{
      query.psqlQuery('DELETE FROM unit_cost WHERE ingredient_id = $1', [id])
      .then((result2)=>{
        query.psqlQuery('DELETE FROM ingredients WHERE id = $1', [id])
        .then((result3)=>{
          resolve(result3);
        })
      }).catch((error)=>{ reject(error)});
    }).catch((error)=>{ reject(error); });
  })
}

query.deleteProduct = (id)=>{
  return new Promise((resolve, reject)=>{
    query.psqlQuery('DELETE FROM products_ingredients WHERE product_id = $1', [id])
    .then((result1)=>{
      query.psqlQuery('DELETE FROM products_categories WHERE product_id = $1', [id])
      .then((result2)=>{
        query.psqlQuery('DELETE FROM products WHERE id = $1', [id])
        .then((result3)=>{
          resolve(result3);
        })
      }).catch((error)=>{ reject(error)});
    }).catch((error)=>{ reject(error); });
  })
}

query.deleteIngredientFromProduct = (productID)=>{
  return new Promise ((resolve, reject)=>{
    query.psqlQuery('DELETE FROM products_ingredients WHERE id = $1', [productID])
    .then((result)=>{
      resolve(result);
    }).catch((error)=>{ reject(error) });
  });
}

query.deleteUOM = (id)=>{
  return new Promise((resolve, reject)=>{
    query.psqlQuery('DELETE FROM unit_cost WHERE uom_id = $1', [id])
    .then((result1)=>{
      query.psqlQuery('DELETE FROM products_ingredients WHERE uom_id = $1', [id])
      .then((result2)=>{
        query.psqlQuery('DELETE FROM uom WHERE id = $1', [id])
        .then((result3)=>{
          resolve(result3);
        })
      }).catch((error)=>{ reject(error)});
    }).catch((error)=>{ reject(error); });
  })
}

query.createUOM = (abbr, name_single, name_plural)=>{
  return new Promise((resolve, reject)=>{
    query.psqlQuery(`INSERT INTO uom (abbr, name_single, name_plural) VALUES ($1, $2, $3)`, [abbr, name_single, name_plural])
    .then(result=>{resolve(result)})
    .catch((error)=>{reject(error)});
  });
}

query.addIngredientToProduct = (productID, ingredientID, uomID, quantity)=>{
  return new Promise((resolve, reject)=>{
    query.psqlQuery('INSERT INTO products_ingredients (product_id, ingredient_id, uom_id, quantity) VALUES ($1, $2, $3, $4)', [productID, ingredientID, uomID, quantity])
    .then(result=>resolve(result))
    .catch((error)=>reject(error))
  });
}

query.createIngredient = (name, description)=>{
  return new Promise((resolve, reject)=>{
    query.psqlQuery(`INSERT INTO ingredients (name, description) VALUES ($1, $2)`, [name, description])
    .then(result=>{resolve(result)})
    .catch((error)=>{reject(error)});
  });
}

query.updateUOM = (id, abbr, name_single, name_plural)=>{
  return new Promise((resolve, reject)=>{
    query.psqlQuery(`UPDATE uom SET abbr = $2, name_single = $3, name_plural = $4, modified_on = NOW() WHERE id = $1`, [id, abbr, name_single, name_plural])
    .then(result=>{resolve(result)})
    .catch((error)=>{reject(error)});
  });
}



query.updateIngredient = (id, name, description)=>{
  return new Promise((resolve, reject)=>{
    query.psqlQuery(`UPDATE ingredients SET name = $2, description = $3,  modified_on = NOW() WHERE id = $1`, [id, name, description])
    .then(result=>{resolve(result)})
    .catch((error)=>{reject(error)});
  });
}

module.exports = query;
