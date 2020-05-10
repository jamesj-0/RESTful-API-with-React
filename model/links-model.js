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

function getLinksByUsername(username) {
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
                // return false; //return error for model tests but throw error for production or routes test
                throw error;
            }
        });
    });
}

function updateLinkbyID(linkId, newdata, owner_id) {
    return getUserPrivilage(owner_id).then(admin => {
        return getLinkById(linkId).then(dbExample => {
            if (dbExample.owner_id === owner_id || admin === true) {
                //check if user wrote the example
                const vals = [newdata.title, newdata.link, linkId];
                return (
                    db
                        .query(
                            "UPDATE links SET title = COALESCE($1, title), link = COALESCE($2, link) WHERE id =($3) RETURNING *",
                            vals
                        )
                        //COALESCE only updates where values are not null
                        .then(res => res.rows[0])
                );
            } else {
                const error = new Error("You do not own this example");
                error.status = 401;
                // return false; //return error for model tests but throw error for production or routes test
                throw error;
            }
        });
    });
}

module.exports = {
    getLinkById,
    getAllLinksByUserId,
    getUserPrivilage,
    getLinksByUsername,
    createLink,
    deleteLink,
    updateLinkbyID
};
