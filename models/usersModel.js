const db = require("../db/connection");

function fetchAllUsers() {
  return db.query(`SELECT * FROM users`).then((users) => {
    const rows = users.rows;
    return rows;
  });
}

function fetchUsersByUsername(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Username Not found" });
      }
      return rows[0];
    });
}

module.exports = { fetchAllUsers, fetchUsersByUsername };
