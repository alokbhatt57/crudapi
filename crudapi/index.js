const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL configuration
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'myapi',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

// Middleware
app.use(bodyParser.json());

// Create a new item
app.post('/items', (req, res) => {
  const { name, description } = req.body;
  const newItem = { name, description };
  const sql = 'INSERT INTO items SET ?';

  db.query(sql, newItem, (err, result) => {
    if (err) {
      throw err;
    }
    console.log('Item created:', result);
    res.status(201).json(result);
  });
});

// Get all items
app.get('/items', (req, res) => {
  const sql = 'SELECT * FROM items';

  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

// Get an item by ID
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM items WHERE id = ?';

  db.query(sql, id, (err, result) => {
    if (err) {
      throw err;
    }
    if (result.length === 0) {
      res.status(404).json({ message: 'Item not found' });
    } else {
      res.json(result[0]);
    }
  });
});

// Update an item by ID
app.put('/items/:id', (req, res) => {
  const { id } = req.params;
  const updatedItem = req.body;
  const sql = 'UPDATE items SET ? WHERE id = ?';

  db.query(sql, [updatedItem, id], (err, result) => {
    if (err) {
      throw err;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Item not found' });
    } else {
      res.json({ message: 'Item updated' });
    }
  });
});

// Delete an item by ID
app.delete('/items/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM items WHERE id = ?';

  db.query(sql, id, (err, result) => {
    if (err) {
      throw err;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Item not found' });
    } else {
      res.json({ message: 'Item deleted' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
