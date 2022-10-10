const fetchAllTopics = require("../models/topicsModel");

function getAllTopics(req, res, next) {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = getAllTopics;
