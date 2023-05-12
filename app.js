const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const hpp = require("hpp");
const { rateLimit } = require("express-rate-limit");

const AppError = require("./utils/appError");

//MIDDLEWARE
const globalErrorHandler = require("./middlewares/error.controller");

//ROUTES
const usersRouter = require("./routes/users.routes");
const restaurantsRouter = require("./routes/restaurants.routes");
const mealsRouter = require("./routes/meals.routes");
const ordersRouter = require("./routes/orders.routes");

//START
const app = express();
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, please try again in one hour! 🙏",
});

app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(xss());
app.use(hpp());

app.use("/api/v1", limiter);

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/restaurants", restaurantsRouter);
app.use("/api/v1/meals", mealsRouter);
app.use("/api/v1/orders", ordersRouter);

app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server! ❌`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
