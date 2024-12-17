
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');


const app = express();
const PORT = 5000;


app.use(bodyParser.json());
app.use(cors());


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Kowsick07@10',
    database: 'employeemahage',
});


db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to the MySQL database');
});




app.get('/employees', (req, res) => {
    const query = 'SELECT * FROM employees';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            return res.status(500).json({ message: 'Internal Server Error', error: err });
        }
        res.json(results);
    });
});

app.post('/employees', (req, res) => {
    const { name, employeeID, email, phoneNumber, dateOfBirth, role, department } = req.body;

    if (!name || !employeeID || !email || !phoneNumber || !dateOfBirth || !role || !department) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO employees (name, employeeID, email, phoneNumber, dateOfBirth, role, department) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [name, employeeID, email, phoneNumber, dateOfBirth, role, department];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error adding employee:', err);
            return res.status(500).json({ message: 'Error adding employee', error: err });
        }
        res.status(201).json({ message: 'Employee added successfully', employeeId: result.insertId });
    });
});


app.delete('/employees', (req, res) => {
    const query = 'DELETE FROM employees';
    db.query(query, (err) => {
        if (err) {
            console.error('Error deleting employees:', err);
            return res.status(500).json({ message: 'Internal Server Error', error: err });
        }
        res.json({ message: 'All employees deleted successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
