const {
  getAllUsers,
  getUserByUsername,
} = require("../controllers/usersController");

const userRouter = require("express").Router();

userRouter.route("/").get(getAllUsers);

userRouter.route("/:username").get(getUserByUsername);

module.exports = userRouter;
