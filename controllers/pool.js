require('dotenv').config();
const {Pool} = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString, ssl: {rejectUnauthorized: false}});

pool.on('error', (err, client)=>{
    console.error('Unexpected error', error);
    process.exit(-1);
});

module.exports = pool;