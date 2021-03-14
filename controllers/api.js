const { json } = require('express');
const express = require('express');
const router = express.Router();
const query = require('./queries');
router.get('/product/:id', (req, res)=>{
    try {
        const id = req.params.id;
        query.getIngredientsByProductId(id, res);        
    } catch (error) {
        console.error(error);
    } 
});

router.get('/products/:name', (req, res) =>{
    try {
        const searchString = req.params.name;
        query.searchProductsByName(searchString, res);  
    } catch (error) {
        console.error(error);
    }
});

router.get('/ingredients/:name', (req, res) =>{

    try {
        const searchString = req.params.name;
        query.searchIngredientsByName(searchString, res);       
    } catch (error) {
        console.error(error);
    }
});

router.post('/ingredients/', (req, res) => {
    try {
        const postRequest = req.body.request;
        if(postRequest){
            var jsonElem = {}
            jsonElem.request = postRequest;
            query.getNutrients(postRequest, res)
        }
        else{
            res.json({"message": "request was empty"})
        }
        
    } catch (error) {
        console.error(error);
    }
    
});

module.exports = router;