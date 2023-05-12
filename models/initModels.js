const Meal = require("./meal.model");
const Order = require("./order.model");
const Restaurant = require("./restaurant.model");
const Review = require("./review.model");
const User = require("./user.model");

const initModel = () => {
  // 1 RESTAURANT <-----> N MEALS
  Restaurant.hasMany(Meal, { foreignKey: "restaurantId" });
  Meal.belongsTo(Restaurant, { foreignKey: "restaurantId" });

  // 1 RESTAURANT <-----> N REVIEWS
  Restaurant.hasMany(Review, { foreignKey: "restaurantId" });
  Review.belongsTo(Restaurant, { foreignKey: "restaurantId" });

  // 1 MEAL <-----> 1 ORDER
  Meal.hasOne(Order, { foreignKey: "mealId" });
  Order.belongsTo(Meal, { foreignKey: "mealId" });

  // 1 USER <-----> N ORDERS
  User.hasMany(Order, { foreignKey: "userId" });
  Order.belongsTo(User, { foreignKey: "userId" });

  // 1 USER <-----> N REVIEWS
  User.hasMany(Review, { foreignKey: "userId" });
  Review.belongsTo(User, { foreignKey: "userId" });
};

module.exports = initModel;
