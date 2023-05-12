const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/token");
const catchAsync = require("../utils/catchAsync");
const Order = require("../models/order.model");
const Meal = require("../models/meal.model");
const Restaurant = require("../models/restaurant.model");
const AppError = require("../utils/appError");

exports.createUser = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(12);
  const passwordEncrypted = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase().trim(),
    email: email.toLowerCase().trim(),
    password: passwordEncrypted,
    role,
  });

  let token = await generateJWT(user.id);

  res.status(201).json({
    status: "success",
    message: "User created successfully!",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const user = req.user;

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Ops!, email or password incorrect"));
  }

  const token = await generateJWT(user.id);

  return res.status(200).json({
    status: "success",
    message: "The user has been logged successfully!",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { userInSection, user } = req;
  const { email, name } = req.body;

  if (!(user.id === userInSection.id)) {
    return next(
      new AppError("Ops!, you cannot update this profile, you not own", 401)
    );
  }

  await userInSection.update({
    email,
    name,
  });

  return res.status(200).json({
    status: "success",
    message: "User updated successfully",
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  const { userInSection } = req;
  const { id } = params;

  if (id !== userInSection.id) {
    return next(
      new AppError("Ops!, you cannot delete this profile, you not own", 401)
    );
  }

  userInSection.update({
    status: "disabled",
  });

  return res.status(200).json({
    status: "success",
    message: "User deleted successully",
  });
});

exports.findOrders = catchAsync(async (req, res, next) => {
  const { userInSection } = req;

  const ordersUser = await Order.findAll({
    where: {
      userId: userInSection.id,
    },
    include: [
      {
        model: Meal,
        attributes: {
          exclude: ["id", "restaurantId", "status"],
        },
        include: [
          {
            model: Restaurant,
            attributes: {
              exclude: ["id", "address", "phone", "rating", "status"],
            },
          },
        ],
      },
    ],
  });

  console.log(ordersUser);

  if (!ordersUser[0]) {
    return next(new AppError("You have no existing orders", 404));
  }

  return res.status(200).json({
    status: "success",
    message: "All orders",
    results: ordersUser.length,
    orders: ordersUser,
  });
});

exports.findOrdersDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { userInSection } = req;

  const orderUser = await Order.findOne({
    where: {
      userId: userInSection.id,
      id,
    },
  });

  if (!orderUser) {
    return next(new AppError("This order not found", 404));
  }

  return res.status(200).json({
    status: "succes",
    message: `Order number: ${orderUser.id}`,
    order: orderUser,
  });
});
