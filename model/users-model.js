const db = require("../db/connection.js");

function createUser(user) {
    return db
        .query(
            "INSERT INTO users(username, email, user_password) VALUES($1, $2, $3) RETURNING *;",
            [user.username, user.email, user.password]
        )
        .then(res => res.rows[0].id);
}

// Get every row from the users table.
function getUsers() {
    return db.query("SELECT * FROM users").then(res => res.rows);
}

// Get a particular user by email
function getUser(email) {
    return db.query("SELECT * FROM users WHERE email = ($1);", [email]).then(res => {
        if (res.rows.length < 1) throw new Error("User does not exist");
        return res.rows[0];
    });
}

function getUserById(id) {
    return db.query("SELECT * FROM users WHERE id = ($1)", [id]).then(res => res.rows[0]);
}

module.exports = {
    createUser,
    getUsers,
    getUser,
    getUserById
};
