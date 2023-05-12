const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/user.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.validCreateUser = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
    },
  });

  if (user) {
    return next(new AppError("Ops! this email already exist"));
  }

  next();
});

exports.validExistEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({
    where: {
      email: email.toLowerCase().trim(),
      status: "available",
    },
  });

  if (!user) {
    return next(new AppError(`Ops!, this email ${email} not exists`, 404));
  }

  req.user = user;
  next();
});

exports.validExistUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    where: {
      id,
      status: "available",
    },
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  req.user = user;
  next();
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in!, please log in to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.SECRET_JWT_SEED
  );

  const user = await User.findOne({
    where: {
      id: decoded.id,
      status: "available",
    },
  });

  if (!user) {
    return next(
      new AppError("The owner of this token not logger available", 401)
    );
  }

  if (user.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );

    if (decoded.iat < changedTimeStamp) {
      next(
        new AppError("User recently changed password!, please login again", 401)
      );
    }
  }

  req.userInSection = user;
  next();
});

exports.protectAccountOwner = catchAsync(async (req, res, next) => {
  const { user, userInSection } = req;

  if (user.id !== userInSection.id) {
    return next(new AppError("You do not own this account", 401));
  }

  next();
});

exports.retrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userInSection.role)) {
      next(
        new AppError("You do not have permission to perform this action!", 401)
      );
    }
    next();
  };
};
