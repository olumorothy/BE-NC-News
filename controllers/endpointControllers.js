const endpoints = require("../endpoints.json");

function getAllEndpoints(req, res, next) {
  res.status(200).send({ endpoints });
}

module.exports = getAllEndpoints;
