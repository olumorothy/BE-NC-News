const getAllTopics = require("./controllers/topicsController");
const {
  getArticlesById,
  patchArticleById,
  getAllArticles,
} = require("./controllers/articlesController");
const getAllUsers = require("./controllers/usersController");
const getAllEndpoints = require("./controllers/endpointControllers");
const {
  getCommentsByArticleId,
  addCommentByArticleId,
  deleteCommentById,
} = require("./controllers/commentsControllers");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/", getAllEndpoints);
app.get("/api/topics", getAllTopics);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/users", getAllUsers);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.patch("/api/articles/:article_id", patchArticleById);

app.post("/api/articles/:article_id/comments", addCommentByArticleId);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ message: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ message: "Bad request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error" });
});

module.exports = app;
