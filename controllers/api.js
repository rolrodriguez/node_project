const { json } = require('express');
const express = require('express');
const router = express.Router();
const query = require('./queries');
const edaman = require('./edaman');
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
        res.json(result);
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

module.exports = router;