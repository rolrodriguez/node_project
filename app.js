/**
 * Amai bakery menu app file
 * 
 * 
 */

// Express
const express = require('express');

// Path
const path = require('path');

// Express app
const app = express();

// Port
const PORT = process.env.PORT || 5000;

// Postgres pool
const pool = require('./pool');

// EXPRESS - Serve public files
app.use(express.static(path.join(__dirname, 'public')));

// EXPRESS - Set views for view engine
app.set('views', path.join(__dirname, 'views'));

// EXPRESS - Set ejs as view engine
app.set('view engine', 'ejs');

// EXPRESS - routes

app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, 'static.html'));
});

// EXPRESS - Handle 404
app.use(function(req, res) {
  res.status(404).send('404: Page not Found');
});

// EXPRESS - Handle server errors
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// EXPRESS - Listen to a port
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
})