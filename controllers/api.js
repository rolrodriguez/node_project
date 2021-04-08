const express = require('express');
const router = express.Router();
const query = require('./queries');
const edaman = require('./edaman');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

/**
 * GET routes
 */

router.get('/ingredients/:name', async (req, res) =>{

    try {
        const searchString = req.params.name;
        const result = await query.searchIngredientsByName(searchString);
        res.json(result);      
    } catch (error) {
        console.error(error);
    }
});

router.get('/ingredient/:id', async (req, res)=>{
    try {
        const id = req.params.id;
        const result = await query.getIngredientById(id);
        res.json(result);
    } catch (error) {
        console.error(error);
    }
});

router.get('/ingredients/', async (req, res)=>{
    try {
       
        const result = await query.getIngredients();
        res.json(result);
    } catch (error) {
        console.error(error);
    }
});

router.get('/product/:id', async (req, res)=>{
    try {
        const id = req.params.id;
        const result = await query.getProductById(id);  
        res.json(result);      
    } catch (error) {
        console.error(error);
    } 
});

router.get('/products/', async (req, res) =>{
    try {
        const result = await query.getLatestProducts(10);
        res.json(result);  
    } catch (error) {
        console.error(error);
    }
});

router.get('/products/:name', async (req, res) =>{
    try {
        const searchString = req.params.name;
        const result = await query.searchProductsByName(searchString);
        res.json(result);  
    } catch (error) {
        console.error(error);
    }
});

router.get('/uoms/', async (req, res)=>{
    try {
        const result = await query.getUOMs();
        res.json(result);
    } catch (error) {
        console.error(error);
    }
});

router.get('/uom/:id', async (req, res)=>{
    try {
        const id = req.params.id;
        const result = await query.getUOMById(id);
        if(result){
            res.json(result);
        }
        else{
            res.json({message: "id not found"});
        }
        
    } catch (error) {
        console.error(error);
    }
});

/**
 * POST routes
 */

router.post('/ingredient/', async (req, res)=>{
    try {
        const name = req.body.name;
        const description = req.body.description
        const result = await query.createIngredient(name, description);
        if(result){
            res.json(req.body);
        }
    } catch (error) {
        console.error(error);
    }
});

router.post('/product/', (req, res)=>{
    const form = formidable.IncomingForm();

    form.parse(req, (err, fields, files)=>{

        const oldPath = files.img.path;
        const newName = Date.now().toString()+files.img.name
        const newPath = path.join(__dirname, '../public/img/')+newName;
        const rawData = fs.readFileSync(oldPath);

        fs.writeFile(newPath, rawData, (err)=>{
            if(err) console.log(err)
           
            query.createProduct(fields.title, fields.desc, newName)
            .then(()=>{
                return res.send('Succesfully uploaded');
            })
            .catch((error)=>{
                console.error(error);
                return res.send('There was an error');
            });
            

        })
    });
})

router.post('/product/ingredient/', async(req, res)=>{
    const productID = req.body.productID;
    const ingredientID = req.body.ingredientID;
    const uomID = req.body.uomID;
    const quantity = req.body.quantity;

    try {
        const result = await query.addIngredientToProduct(productID, ingredientID, uomID, quantity);
        const confirmation = await query.getProductById(productID);
        res.json(confirmation);
    } catch (error) {
        console.error(error);
    }

});

router.post('/recipe/', async (req, res) => {
    try {
        const postRequest = JSON.stringify(req.body);
        if(postRequest){
            let edamanRes = await edaman.queryRecipe(postRequest);
            res.json(edamanRes);
        }
        else{
            res.json({"message": "request was empty"})
        }
        
    } catch (error) {
        console.error(error);
    }
    
});

router.post('/uom/', async (req, res)=>{
    try {
        const abbr = req.body.abbr;
        const name_single = req.body.name_single;
        const name_plural = req.body.name_plural;
        const result = await query.createUOM(abbr, name_single, name_plural);
        if(result){
            res.json(req.body);
        }
    } catch (error) {
        console.error(error);
    }
});

/**
 * PUT routes
 */

router.put('/ingredient/:id', async (req, res)=>{
    try{
        const id = req.params.id;
        const name = req.body.name;
        const description = req.body.description;
        const result = await query.updateIngredient(id, name, description);
        if (result){
            res.json(req.body);    
        }
        else{
            res.json({message: "resource was not found"});  
        }
        
    }catch(error){
        console.error(error);
    }
});

router.put('/product/:id', async (req, res)=>{
    try {
        const id = req.params.id;
        const name = req.body.name;
        const desc = req.body.desc;
        const result = await query.updateProduct(id, name, desc)
        if(result.rowCount > 0){
            res.json({id, name, desc});
        }
        else{
            res.json({message: "id not found"});
        }
        
    } catch (error) {
        console.error(error);
    }
});

router.put('/uom/:id', async (req, res)=>{
    try {
        const id = req.params.id;
        const abbr = req.body.abbr;
        const name_single = req.body.name_single;
        const name_plural = req.body.name_plural;
        const result = await query.updateUOM(id, abbr, name_single, name_plural);
        if(result){
            res.json({id, abbr, name_single, name_plural});
        }
        else{
            res.json({message: "id not found"});
        }
        
    } catch (error) {
        console.error(error);
    }
});

/**
 * DELETE routes
 */

 router.delete('/ingredient/:id', async (req, res)=>{
    try{
        const id = req.params.id;
        const result = await query.deleteIngredient(id);
        if (result.rowCount != 0){
            res.json({message: "resource deleted"});    
        }
        else{
            res.json({message: "resource was not found"});  
        }
        
    }catch(error){
        console.error(error);
    }
});

router.delete('/product/ingredient/:id', async (req, res)=>{
    const id = req.params.id;

    if (id){
        try{
            const result = await query.deleteIngredientFromProduct(id);
            if (result.rowCount != 0){
                res.json({message: "resource deleted"});    
            }
            else{
                res.json({message: "resource was not found"});  
            }
        }catch(error){
            console.log(error);
        }
        
    }
    res.json({message: "parameters passed are not valid"})
});

router.delete('/product/:id', async (req, res)=>{
    try{
        const id = req.params.id;
        const result = await query.deleteProduct(id);
        if (result.rowCount != 0){
            res.json({message: "resource deleted"});    
        }
        else{
            res.json({message: "resource was not found"});  
        }
    }catch(error){
        console.error(error);
    }
});

router.delete('/uom/:id', async (req, res)=>{
    try{
        const id = req.params.id;
        const result = await query.deleteUOM(id);
        if (result.rowCount != 0){
            res.json({message: "resource deleted"});    
        }
        else{
            res.json({message: "resource was not found"});  
        }
    }catch(error){
        console.error(error);
    }
});


module.exports = router;