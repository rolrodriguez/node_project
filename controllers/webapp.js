const express = require('express');
const pool = require('./pool');
const path = require('path');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '..', '/views/pages/index.html'));
});

router.get('/login', (req, res)=>{
    if(req.session.userID){
        res.redirect('/admin');
    }
    else{
        res.render(path.join(__dirname, '..', '/views/login'));
    }
});

router.post('/login', (req, res)=>{
    const user = req.body.username;
    const pass = req.body.password;
    pool.connect((err, client, done) => {
        if (err) throw err
        client.query('SELECT id, username, password from users WHERE username = $1', [user],(err, result) => {
          done();
          if (result) {
            bcrypt.compare(pass, result.rows[0]['password']).then(testResult=>{
                if(testResult){
                    req.session.userID = result.rows[0]['id'];
                    res.redirect('/admin');
                }
                else{
                    res.redirect('/login');
                }
            });
          }
        })
      })
});

router.get('/logout', (req, res)=>{
    if(req.session.userID){
        delete req.session.userID;
    }
    res.redirect('/login');
});

router.get('/admin', (req, res)=>{
    if(req.session.userID){
        res.render(path.join(__dirname, '..', '/views/admin'));
    }
    else{
        res.redirect('/login');
    }
});

module.exports = router;