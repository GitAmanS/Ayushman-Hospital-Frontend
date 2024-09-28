const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
require('dotenv').config();
const cors = require('cors')
const path = require('path');
const app = express();
app.use(bodyParser.json());
app.use(cookieParser()); // Add cookie-parser middleware
app.use(cors());
// Connect to the database
connectDB();

// Use the auth routes
app.use('/api/auth', authRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The catchall handler for any request that doesn't match one above
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
