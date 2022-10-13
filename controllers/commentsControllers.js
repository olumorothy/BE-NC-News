const fetchArticleById = require("../models/articlesModel");
const fetchCommentsByArticleId = require("../models/commentsModel");

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

module.exports = getCommentsByArticleId;
