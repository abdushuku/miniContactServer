const mysql = require('mysql2');

const db = mysql.createConnection(process.env.DATABASE_URL);

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the MySQL database.');
    }
});

module.exports = db;