const express = require('express');
const router = express.Router();
const query = require('../queries');
router.get('/product/:id', (req, res)=>{
    const id = req.params.id;
    query.getIngredientsByProductId(id, res);  
});

router.get('/products/:name', (req, res) =>{
    const searchString = req.params.name;
    query.searchProductsByName(searchString, res);
});

router.get('/ingredients/:name', (req, res) =>{
    const searchString = req.params.name;
    query.searchIngredientsByName(searchString, res);
});

router.post('/ingredients/', (req, res) => {
    console.dir(req.body);
    res.send('RECEIVED POST REQUEST');
});

module.exports = router;