// db.js
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
    host: 'db',  
    user: 'simpleuser',
    password: 'simplepassword', 
    database: 'simpledb',  
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export promise-based pool
module.exports = pool.promise();
