const db = require("../db/connection.js");

function getLinkById(id) {
    return db.query("SELECT * FROM links WHERE id=($1)", [id]).then(res => res.rows[0]);
}

function getAllLinksByUserId(id) {
    return db.query("SELECT * FROM links WHERE owner_id=($1)", [id]).then(res => res.rows);
}

function getLinkByUsername(username) {
    return db
        .query(
            `SELECT users.username, links.id, links.owner_id, links.title, links.link FROM links INNER JOIN users ON users.id = links.owner_id
            WHERE users.username = ($1)`,
            [username]
        )
        .then(res => res.rows);
}

// function getAllExamples() {
//     return db
//         .query(
//             `SELECT
//     users.username,
//     examples.id,
//     examples.owner_id,
//     examples.language,
//     examples.title,
//     examples.example,
//     examples.date
//     FROM
//     examples INNER JOIN users ON users.id = examples.owner_id
//     ORDER BY examples.date DESC;`
//         )
//         .then(result => result.rows)
//         .catch(error => {
//             console.log("Error at getAllExamples handler is :" + error);
//         });
// }

// function createExample(example) {
//     return db
//         .query(
//             "INSERT INTO examples(owner_id, language, title, example) VALUES($1, $2, $3, $4) RETURNING id",
//             [example.user_id, example.language, example.title, example.example]
//         )
//         .then(result => {
//             return result.rows[0].id;
//         })
//         .catch(error => {
//             console.log("Error in model/examples.js, createExample()", error);
//         });
// }

// function deleteExample(exampleId, user) {
//     return getExample(exampleId).then(exampleObjectFromDB => {
//         if (exampleObjectFromDB.owner_id === user.id || user.adminusr) {
//             // check if user is authorised
//             return db
//                 .query("DELETE FROM examples WHERE id = ($1);", [exampleId])
//                 .then(result => true)
//                 .catch(err => {
//                     const error = new Error("Delete query failed!" + err.message);
//                     error.status = 400;
//                     throw error;
//                 });
//         } else {
//             const error = new Error("Only owner or admin can delete this.");
//             error.status = 403;
//             throw error;
//             return false;
//         }
//     });
// }

// function updateExamplebyID(postId, newdata, userId) {
//     return getExample(postId).then(dbExample => {
//         if (dbExample.owner_id === userId) {
//             //check if user wrote the example
//             const vals = [newdata.language, newdata.title, newdata.example, postId];
//             return (
//                 db
//                     .query(
//                         "UPDATE examples SET language = COALESCE($1, language), title = COALESCE($2, title), example = COALESCE($3, example) WHERE id =($4) RETURNING *",
//                         vals
//                     )
//                     //COALESCE only updates where values are not null
//                     .then(res => res.rows[0])
//             );
//         } else {
//             console.log("THE ERROR IS:", error);
//             const error = new Error("You do not own this example");
//             error.status = 321;
//             throw error;
//         }
//     });
// }

module.exports = {
    getLinkById,
    getAllLinksByUserId,
    getLinkByUsername
    // createExample,
    // deleteExample,
    // updateExamplebyID
};
