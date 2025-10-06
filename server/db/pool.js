const { Pool } = require('pg');
require('dotenv').config();

console.log('--- Database Pool Connection Details ---');
console.log(`PGUSER: ${process.env.PGUSER}`);
console.log(`PGHOST: ${process.env.PGHOST}`);
console.log(`PGDATABASE: ${process.env.PGDATABASE}`);
// NOTE: We don't log the password for security, but we know it's being used.
console.log(`PGPORT: ${process.env.PGPORT || 5432}`);
console.log('----------------------------------------');


// Database Connection Setup
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE, 
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT || 5432,
});

// Test Database Connection
pool.connect()
    .then(client => {
        console.log('Database connection successful!');
        client.release(); 
    })
    .catch(err => {
        console.error('CRITICAL: Error connecting to database:', err.stack);
    });

// Export the pool instance so controllers can use it directly
module.exports = pool;
