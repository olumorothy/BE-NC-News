const getAllTopics = require("./controllers/topicsController");
const getArticlesById = require("./controllers/articlesController");
const express = require("express");
const app = express();

app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticlesById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(404).send({ message: "Not Found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ message: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error" });
});

module.exports = app;
