require('dotenv').config();
const {Pool} = require('pg');
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const connectionString = process.env.DATABASE_URL;

// Serve public files
app.use(express.static(path.join(__dirname, 'public')));

// Set views for view engine
app.set('views', path.join(__dirname, 'views'));

// Set ejs as view engine
app.set('view engine', 'ejs');

// Request to root path
app.get('/getPerson/:id', (req, res) => {
  const id = req.params.id;
  const pool = new Pool({connectionString, ssl: {rejectUnauthorized: false}});

  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

  pool.connect((err, client, done) => {
    if (err) throw err
    client.query('SELECT * FROM person WHERE id = $1', [id], (err, res) => {
      done()
      if (err) {
        console.log(err.stack)
      } else {
        console.log(res.rows[0])
      }
    })
  })

  res.status(200).send(id);
});

// Handle 404
app.use(function(req, res) {
  res.status(404).send('404: Page not Found');
});

// Handle server errors
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
})