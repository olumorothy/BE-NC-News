const {
  fetchArticleById,
  updateArticleById,
  fetchAllArticles,
} = require("../models/articlesModel");
const fetchAllTopics = require("../models/topicsModel");

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
  const { sort_by, topic } = req.query;

  const promises = [fetchAllArticles(topic, sort_by)];

  if (topic) {
    promises.push(fetchAllTopics());
  }
  Promise.all(promises)
    .then((promises) => {
      if (promises[1]) {
        let isValid = false;
        promises[1].forEach((promise) => {
          if (promise.slug === topic) {
            isValid = true;
          }
        });

        if (!isValid) {
          return Promise.reject({ status: 400, msg: "Invalid Topic" });
        } else {
          res.status(200).send({ articles: promises[0] });
        }
      } else {
        res.status(200).send({ articles: promises[0] });
      }
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticlesById, patchArticleById, getAllArticles };
