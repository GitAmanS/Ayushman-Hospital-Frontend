const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
require('dotenv').config();
const cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(cookieParser()); // Add cookie-parser middleware
app.use(cors());
// Connect to the database
connectDB();

// Use the auth routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
