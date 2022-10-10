const getAllTopics = require("./controllers/topicsController");
const express = require("express");
const app = express();

app.get("/api/topics", getAllTopics);

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error" });
});

module.exports = app;
