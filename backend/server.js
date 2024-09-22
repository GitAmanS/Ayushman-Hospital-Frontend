const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');  // Import cookie-parser
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());  // Use cookie-parser middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error: ', err));

// Routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
