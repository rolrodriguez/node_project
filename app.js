/**
 * Amai bakery menu app file
 * 
 * @author Rolando Rodriguez
 */

// Express
const express = require('express');
const session = require('express-session');

// Morgan
const morgan = require('morgan');

// Express Routers
const api = require('./controllers/api');
const webapp = require('./controllers/webapp');
// const admin = require('./controllers/admin');

// Path
const path = require('path');

// Express app
const app = express();

// Port
const PORT = process.env.PORT || 5000;

// EXPRESS - Serve public files
app.use(express.static(path.join(__dirname, 'public')));

// EXPRESS - sessions
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.SECRET
}));

// EXPRESS - Set views for view engine
app.set('views', path.join(__dirname, 'views'));

// EXPRESS - Set ejs as view engine
app.set('view engine', 'ejs');

// EXPRESS - Use middleware parser for json request
app.use(express.json());

// EXPRESS - Use middleware parser for form requests
app.use(express.urlencoded({extended: false}));

// MORGAN - logger middleware
app.use(morgan('tiny'));

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