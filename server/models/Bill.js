const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bill = sequelize.define('Bill', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    customerName: {
        type: DataTypes.STRING,
    },
    items: {
        type: DataTypes.JSON, // Stores array of { productId, name, qty, price }
    },
    totalAmount: {
        type: DataTypes.FLOAT,
    },
    pdfUrl: {
        type: DataTypes.STRING, // Path to generated PDF
    }
});

module.exports = Bill;
