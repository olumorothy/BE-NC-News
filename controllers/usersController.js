const { fetchAllUsers, fetchUsersByUsername } = require("../models/usersModel");

function getAllUsers(req, res, next) {
  fetchAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
}

function getUserByUsername(req, res, next) {
  const { username } = req.params;
  fetchUsersByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getAllUsers, getUserByUsername };
