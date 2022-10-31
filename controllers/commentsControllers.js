const { fetchArticleById } = require("../models/articlesModel");
const {
  fetchCommentsByArticleId,
  insertComment,
  removeCommentById,
  updateCommentById,
} = require("../models/commentsModel");

function getCommentsByArticleId(req, res, next) {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function addCommentByArticleId(req, res, next) {
  const { article_id } = req.params;
  const { username, body } = req.body;
  //first check if article exist.
  const promises = [
    fetchArticleById(article_id),
    insertComment(username, body, article_id),
  ];
  Promise.all(promises)
    .then((promise) => {
      res.status(201).send({ comment: promise[1] });
    })
    .catch((err) => {
      next(err);
    });
}
function deleteCommentById(req, res, next) {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

function patchCommentById(req, res, next) {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}
module.exports = {
  getCommentsByArticleId,
  addCommentByArticleId,
  deleteCommentById,
  patchCommentById,
};
