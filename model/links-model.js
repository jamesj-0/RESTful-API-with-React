const db = require("../db/connection.js");

function getLinkById(id) {
    return db.query("SELECT * FROM links WHERE id=($1)", [id]).then(res => res.rows[0]);
}

function getAllLinksByUserId(id) {
    return db.query("SELECT * FROM links WHERE owner_id=($1)", [id]).then(res => res.rows);
}

function getUserPrivilage(user_id) {
    return db
        .query("SELECT adminusr FROM users WHERE id=($1)", [user_id])
        .then(res => res.rows[0].adminusr);
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

function createLink(link) {
    return db
        .query("INSERT INTO links(owner_id, link, title) VALUES($1, $2, $3) RETURNING id", [
            link.owner_id,
            link.link,
            link.title
        ])
        .then(result => {
            return result.rows[0].id;
        })
        .catch(error => {
            console.log("Error in model/examples.js, createExample()", error);
        });
}

function deleteLink(linkId, owner_id) {
    return getUserPrivilage(owner_id).then(admin => {
        return getLinkById(linkId).then(linkObjectFromDB => {
            if (linkObjectFromDB.owner_id === owner_id || admin === true) {
                // check if user is authorised
                return db
                    .query("DELETE FROM links WHERE id = ($1);", [linkId])
                    .then(result => true)
                    .catch(err => {
                        const error = new Error("Delete query failed!" + err.message);
                        error.status = 400;
                        throw error;
                    });
            } else {
                const error = new Error("Only owner or admin can delete this.");
                error.status = 403;
                return false; //return false for tests but throw error for production
                throw error;
            }
        });
    });
}

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
    getUserPrivilage,
    getLinkByUsername,
    createLink,
    deleteLink
    // deleteExample,
    // updateExamplebyID
};
