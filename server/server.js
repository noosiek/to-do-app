const PORT = process.env.PORT || 8000;
const express = require('express');
const cors = require('cors');
const app = express();
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());
app.post('/api/todos', async (req, res) => {
  try {
    const { user_email, title, progress, date, notes, status, task_category, due_date } = req.body;
    const newToDo = await pool.query(
      'INSERT INTO todos (user_email, title, progress, date, notes, status, task_category, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [user_email, title, progress, date, notes, status, task_category, due_date]
    );
    res.json(newToDo.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific todo by id 
app.get('/api/todos/id/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    res.json(todo.rows[0]); 
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Get all todos for user by userEmail with an optional status filter
app.get('/api/todos/:userEmail', async (req, res) => {
  const { userEmail } = req.params;
  const { status, task_category } = req.query; 
  try {
    let query = 'SELECT * FROM todos WHERE user_email = $1';
    let params = [userEmail];

    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }

    if (task_category) { 
      query += ' AND task_category = $3';
      params.push(task_category);
    }

    const todos = await pool.query(query, params);
    res.json(todos.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit a todo
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date, notes, status, task_category, due_date } = req.body;
  try {
    await pool.query(
      'UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4, notes = $5, status = $6, task_category = $7, due_date = $8 WHERE id = $9',
      [user_email, title, progress, date, notes, status, task_category, due_date, id]
    );
    res.json({ message: 'Todo updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// sign up
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user already exists
    const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userQuery.rows.length > 0) {
      return res.status(409).json({ error: "Email already in use." }); 
    }

   
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const signUpResult = await pool.query(
      'INSERT INTO users (email, hashed_password) VALUES ($1, $2) RETURNING *', 
      [email, hashedPassword]
    );


    if (signUpResult.rows && signUpResult.rows.length > 0) {
      const newUser = signUpResult.rows[0];
      const token = jwt.sign({ email: newUser.email }, 'secret', { expiresIn: '1h' });

      res.json({ email: newUser.email, token });
    } else {
   
      return res.status(500).json({ error: 'Unexpected error during registration.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (!users.rows.length) return res.status(401).json({ detail: 'User does not exist' });

    const success = await bcrypt.compare(password, users.rows[0].hashed_password);

    if (success) {
      const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' });
      res.json({ email: users.rows[0].email, token });
    } else {
      res.status(401).json({ detail: 'Login failed' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
