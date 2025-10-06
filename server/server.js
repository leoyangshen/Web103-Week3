const express = require('express');
const cors = require('cors');
const locationRoutes = require('./routes/locations'); 
// We now import pool from the dedicated database file
const pool = require('./db/pool'); 

const app = express();
// Use port 3001 as established earlier
const PORT = process.env.PORT || 3001; 

// Middleware
app.use(cors());
app.use(express.json());

// Basic Root Route Check
app.get('/', (req, res) => {
    res.send('Aura Nexus API is running! Access /api/locations for data.');
});

// Mount the Location Routes at the /api path
app.use('/api', locationRoutes); 

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API URL: http://localhost:${PORT}/api/locations`);
});
