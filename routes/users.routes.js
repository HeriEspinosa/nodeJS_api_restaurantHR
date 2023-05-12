const express = require("express");

//MIDDLEWARES
const {
  createUserValidation,
  loginUserValidation,
} = require("../middlewares/validations.middleware");
const {
  retrictTo,
  protect,
  validExistEmail,
  protectAccountOwner,
  validExistUser,
  validCreateUser,
} = require("../middlewares/user.middleware");

//CONTROLLERS
const {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  findOrders,
  findOrdersDetails,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/signup", createUserValidation, validCreateUser, createUser);
router.post("/login", loginUserValidation, validExistEmail, loginUser);

router.use(protect);

router
  .route("/:id")
  .patch(validExistUser, protectAccountOwner, updateUser)
  .delete(validExistUser, protectAccountOwner, deleteUser);

router.get("/orders", findOrders);
router.get("/orders/:id", findOrdersDetails);

//ADMIN
router.use(retrictTo("admin"));
router.route("/admin/:id").get().get().patch().delete().post();

module.exports = router;
