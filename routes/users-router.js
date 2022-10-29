const getAllUsers = require("../controllers/usersController");

const userRouter = require("express").Router();

userRouter.route("/").get(getAllUsers);

module.exports = userRouter;
