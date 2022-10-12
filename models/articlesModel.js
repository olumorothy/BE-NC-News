const db = require("../db/connection");

function fetchArticleById(article_id) {
  return db
    .query(
      `
    SELECT articles.* ,COUNT (comments.article_id) ::INT AS comment_count
    FROM articles 
    LEFT JOIN comments ON comments.article_id = articles.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`,
      [article_id]
    )
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

function fetchAllArticles(sort_by) {
  const validSortValues = ["created_at", "topic"];

  baseQuery = `SELECT articles.* ,COUNT (comments.article_id) ::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON comments.article_id = articles.article_id
  WHERE articles.article_id = comments.article_id
  GROUP BY articles.article_id `;

  if (!sort_by) {
    return db.query(`SELECT * FROM articles`).then(({ rows }) => {
      return rows;
    });
  } else {
    if (!validSortValues.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid sort value provided",
      });
    }
    baseQuery += `ORDER BY ${sort_by} DESC`;
  }
  return db.query(baseQuery).then(({ rows }) => {
    return rows;
  });

  // if (sort_by) {
  //   if (!validSortValues.includes(sort_by)) {
  //     return Promise.reject({
  //       status: 400,
  //       msg: "Invalid sort value provided",
  //     });
  //   }
  //   baseQuery += `ORDER BY ${sort_by} DESC`;
  // }
  // return db.query(baseQuery).then(({ rows }) => {
  //   return rows;
  // });
}

module.exports = { fetchArticleById, updateArticleById, fetchAllArticles };
