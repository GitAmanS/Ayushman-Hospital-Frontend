const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js')
const userRoutes = require('./routes/userRoutes.js')
require('dotenv').config();
const cors = require('cors')
const path = require('path');
const app = express();
app.use(bodyParser.json());
app.use(cookieParser()); // Add cookie-parser middleware
const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests from any origin
      callback(null, origin || '*');
    },
    credentials: true, // Allow credentials (cookies, tokens, etc.)
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  };
  
app.use(cors(corsOptions));
// Connect to the database
connectDB();

// Use the auth routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', userRoutes)

app.use('/uploads', express.static('uploads'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, './frontend/build')));
app.use(express.static(path.join(__dirname, './admin-panel/build')));

// Serve the admin panel on the /admin path
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, './admin-panel/build', 'index.html'));
});

// Serve the frontend on the root path
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/build', 'index.html'));
});

// app.use(express.static(path.resolve(__dirname, 'admin-panel', 'build')));
// app.get("/admin/*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'admin-panel', 'build', 'index.html'), function (err) {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });
// });

// // Serve the frontend on all other paths
// app.use(express.static(path.resolve(__dirname, 'frontend', 'build')));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'), function (err) {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });
// });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
