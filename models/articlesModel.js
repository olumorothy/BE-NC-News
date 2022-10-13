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

function fetchAllArticles(topic, sort_by = "created_at", order = "DESC") {
  const validSortValues = [
    "topic",
    "created_at",
    "title",
    "author",
    "body",
    "votes",
  ];
  const validOrders = ["DESC", "ASC"];

  if (!validSortValues.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort value" });
  }
  if (!validOrders.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order value" });
  }

  baseQuery = `SELECT articles.* ,COUNT (comment_id) ::INT AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id=comments.article_id `;

  if (topic !== undefined) {
    baseQuery += `WHERE articles.topic = $1
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`;
  } else {
    baseQuery += `GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`;
  }

  if (topic) {
    return db.query(baseQuery, [topic]).then(({ rows: artcles }) => {
      return artcles;
    });
  } else {
    return db.query(baseQuery).then(({ rows: articles }) => {
      return articles;
    });
  }
}

module.exports = { fetchArticleById, updateArticleById, fetchAllArticles };
