const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MarketingPost = sequelize.define('MarketingPost', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING, // 'image_ad', 'text_post', 'review_reply'
    },
    content: {
        type: DataTypes.TEXT, // The generated text
    },
    imageUrl: {
        type: DataTypes.STRING, // The generated image URL
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'draft' // draft, published
    }
});

module.exports = MarketingPost;
