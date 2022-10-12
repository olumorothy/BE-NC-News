const {
  fetchArticleById,
  updateArticleById,
  fetchAllArticles,
} = require("../models/articlesModel");

function getArticlesById(req, res, next) {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticleById(req, res, next) {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  updateArticleById(article_id, inc_votes)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(req, res, next) {
  const { sort_by } = req.query;
  fetchAllArticles(sort_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticlesById, patchArticleById, getAllArticles };
