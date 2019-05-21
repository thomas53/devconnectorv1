const express = require('express');

const connectDB = require('./config/db');
const auth = require('./api/auth');
const profile = require('./api/profile');
const posts = require('./api/posts');
const users = require('./api/users');

const app = express();

// Connect to database
connectDB();

// Add Middleware
app.use(express.json({ extends: false }));

app.get('/', (req, res) => res.send('Hello World'));
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
app.use('/api/users', users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
