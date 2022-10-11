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

function updateArticleById(article_id, inc_votes) {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Bad request,no value to update",
    });
  } else {
    return db
      .query(
        `UPDATE articles SET votes = votes + $2 WHERE article_id = $1 RETURNING *`,
        [article_id, inc_votes]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Not found!" });
        } else {
          return rows[0];
        }
      });
  }
}

module.exports = { fetchArticleById, updateArticleById };
