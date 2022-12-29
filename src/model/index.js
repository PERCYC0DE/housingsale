import Category from "./Category.js";
import Price from "./Price.js";
import Property from "./Property.js ";
import User from "./User.js ";
import Message from "./Message.js";

// Price.hasOne(Property);
Property.belongsTo(Price, { foreignKey: "priceId" });
Property.belongsTo(Category, { foreignKey: "categoryId" });
Property.belongsTo(User, { foreignKey: "userId" });
Property.hasMany(Message, { foreignKey: "propertyId" });

Message.belongsTo(Property, { foreignKey: "propertyId" });
Message.belongsTo(User, { foreignKey: "userId" });

export { Category, Price, Property, User, Message };
