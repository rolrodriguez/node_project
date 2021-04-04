require('dotenv').config();
const {Pool} = require('pg');
const connectionString = process.env.DATABASE_URL_LOCAL;
// const pool = new Pool({connectionString, ssl: {rejectUnauthorized: false}});
const pool = new Pool({connectionString});
pool.on('error', (err, client)=>{
    console.error('Unexpected error', error);
    process.exit(-1);
});

module.exports = pool;