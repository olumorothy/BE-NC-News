const db = require("../db/connection");

function fetchArticleById(article_id) {
  return db
    .query(`SELECT * FROM articles where article_id=$1;`, [article_id])
    .then((articles) => {
      const result = articles.rows[0];

      if (!result) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      } else {
        return result;
      }
    });
}

module.exports = fetchArticleById;
