const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    res.send('Welcome to the web app!!!');
});

module.exports = router;