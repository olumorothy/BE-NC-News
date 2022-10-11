const db = require("../db/connection");

function fetchArticleById(article_id) {
  return db
    .query(`SELECT * FROM articles where article_id=$1;`, [article_id])
    .then(({ rows }) => {
      //const result = articles.rows[0];
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      return rows[0];
    });
}

module.exports = fetchArticleById;
