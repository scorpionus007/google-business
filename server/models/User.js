const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    businessName: {
        type: DataTypes.STRING,
    },
    category: {
        type: DataTypes.STRING,
    },
    businessType: {
        type: DataTypes.STRING, // e.g., 'Retail', 'Pathology', 'Tuition'
    }
});

module.exports = User;
