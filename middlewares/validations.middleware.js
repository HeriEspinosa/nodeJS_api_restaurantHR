const { body, validationResult } = require("express-validator");

const validFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      errors: errors.mapped(),
    });
  }

  next();
};

exports.createUserValidation = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Must be a valid email"),
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength()
    .withMessage("Password must be at least 8 characaters long"),
  validFields,
];

exports.loginUserValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Must be a valid email"),
  body("password").notEmpty().withMessage("The password cannot be empty"),
  validFields,
];
