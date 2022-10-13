const db = require("../db/connection");
function fetchCommentsByArticleId(article_id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id=$1
    ORDER BY created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found!" });
      }
      return rows;
    });
}

function insertComment(username, body, article_id) {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `
      INSERT INTO comments (author, body, article_id)
      VALUES ($1, $2, $3)
      RETURNING body, votes, author, comment_id, created_at;
      `,
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = { fetchCommentsByArticleId, insertComment };
