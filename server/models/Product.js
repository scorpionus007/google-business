const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
    },
    price: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    imageUrl: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    }
});

module.exports = Product;
