const User = require('./User');
const Product = require('./Product');
const Bill = require('./Bill');
const MarketingPost = require('./MarketingPost');

// Define Associations
User.hasMany(Product, { foreignKey: 'userId', onDelete: 'CASCADE' });
Product.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Bill, { foreignKey: 'userId', onDelete: 'CASCADE' });
Bill.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(MarketingPost, { foreignKey: 'userId', onDelete: 'CASCADE' });
MarketingPost.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Product, Bill, MarketingPost };
