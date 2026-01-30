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
const authRoutes = require('./routes/auth.routes');
const voiceRoutes = require('./routes/voice.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const marketingRoutes = require('./routes/marketing.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const googleRoutes = require('./routes/google.routes');
const whatsappRoutes = require('./routes/whatsapp.routes');

app.use('/api/auth', authRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/website', require('./routes/website.routes'));
app.use('/api/billing', require('./routes/billing.routes'));

// Test Route
app.get('/', (req, res) => {
    res.send('MSME Voice Box Backend is Running');
});

// Database Connection and Server Start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        // Load Associations
        require('./models/associations');

        // Sync models - using { force: false } to not drop tables
        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
};

startServer();
