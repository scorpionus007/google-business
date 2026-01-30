const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/voice', require('./routes/voice.routes'));
app.use('/api/inventory', require('./routes/inventory.routes'));
app.use('/api/marketing', require('./routes/marketing.routes'));

// Test Route
app.get('/', (req, res) => {
    res.send('MSME Voice Box Backend is Running');
});

// Database Connection and Server Start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
        // Sync models - using { force: false } to not drop tables
        await sequelize.sync({ force: true });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

startServer();
