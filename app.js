/**
 * Amai bakery menu app file
 * 
 * 
 */

// Express
const express = require('express');

const bodyParser = require('body-parser');

// Express Routers
const api = require('./controllers/api');
const webapp = require('./controllers/webapp');

// Path
const path = require('path');

// Express app
const app = express();

// Port
const PORT = process.env.PORT || 5000;

// EXPRESS - Serve public files
app.use(express.static(path.join(__dirname, 'public')));

// EXPRESS - Set views for view engine
app.set('views', path.join(__dirname, 'views'));

// EXPRESS - Set ejs as view engine
app.set('view engine', 'ejs');

// EXPRESS - Use middleware parser for json request
app.use(express.json());

// EXPRESS - Use middleware parser for form requests
app.use(express.urlencoded({extended: false}));

// EXPRESS - defining route controllers
app.use('/', webapp);
app.use('/api', api);

// EXPRESS - Handle 404
app.use(function(req, res) {
  res.status(404).send('404: Page not Found');
});

// EXPRESS - Handle server errors
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

// EXPRESS - Listen to a port
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
})