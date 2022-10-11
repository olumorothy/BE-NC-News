const db = require("../db/connection");
function fetchAllUsers() {
  return db.query(`SELECT * FROM users`).then((users) => {
    const rows = users.rows;
    return rows;
  });
}

module.exports = fetchAllUsers;
