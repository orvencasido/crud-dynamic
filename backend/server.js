const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'simpleuser',
    password: process.env.DB_PASSWORD || 'simplepassword',
    database: process.env.DB_NAME || 'simpledb'
});

// Test database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Successfully connected to database');
});

// Read all items
app.get('/items', (req, res) => {
    console.log('GET /items request received');
    db.query('SELECT * FROM items', (err, results) => {
        if (err) {
            console.error('Error fetching items:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Items fetched successfully:', results);
        res.json(results);
    });
});

// Create new item
app.post('/items', (req, res) => {
    console.log('POST /items request received:', req.body);
    const { name } = req.body;
    db.query('INSERT INTO items (name) VALUES (?)', [name], (err, results) => {
        if (err) {
            console.error('Error creating item:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Item created successfully:', results);
        res.json({ message: 'Item added', id: results.insertId });
    });
});

// Delete item
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    console.log('DELETE /items/:id request received for ID:', id);
    
    // Validate ID
    if (!id || isNaN(parseInt(id))) {
        console.error('Invalid ID provided:', id);
        return res.status(400).json({ error: 'Invalid item ID' });
    }

    db.query('DELETE FROM items WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Delete error:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Delete results:', results);
        if (results.affectedRows === 0) {
            console.log('No item found with ID:', id);
            return res.status(404).json({ error: 'Item not found' });
        }
        console.log('Successfully deleted item with ID:', id);
        res.json({ message: 'Item deleted successfully' });
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
