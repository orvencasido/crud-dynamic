const express = require('express');
const cors = require('cors');
const db = require('./db'); // import the db connection pool

const app = express();
app.use(cors());
app.use(express.json());

// Function to test database connection
async function testConnection() {
    try {
        await db.query('SELECT 1');
        console.log('Database connection successful');
        return true;
    } catch (err) {
        console.log('Database connection failed, retrying in 5 seconds...');
        return false;
    }
}

// Wait for database to be ready
async function waitForDatabase() {
    let isConnected = false;
    while (!isConnected) {
        isConnected = await testConnection();
        if (!isConnected) {
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
}

// Get all items
app.get('/items', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM items');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// Add new item
app.post('/items', async (req, res) => {
    const { name } = req.body;
    try {
        const [result] = await db.query('INSERT INTO items (name) VALUES (?)', [name]);
        res.status(201).json({ id: result.insertId, name });
    } catch (err) {
        console.error(err);
        res.status(500).send('Database error');
    }
});

// Delete item
app.delete('/items/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM items WHERE id = ?', [id]);
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start server
waitForDatabase().then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
});
