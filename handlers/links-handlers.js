const {
    getLinksByUsername,
    createLink,
    deleteLink,
    updateLinkbyID
} = require("../model/links-model");

function getAllLinks(req, res, next) {
    getLinksByUsername(req.params.userName)
        .then(example => res.send(example))
        .catch(next);
}

// Inserts a new link into the links table and returns the inserted row's id
function postLink(req, res, next) {
    req.body.user_id = req.user.id;
    req.body.admin = req.user.admin;
    createLink(req.body)
        .then(linkId => {
            res.status(201).send({
                linkId: linkId
            });
        })
        .catch(next);
}

function removeLink(req, res, next) {
    deleteLink(req.params.id, req.user.id)
        .then(() => {
            res.status(200).send({deleted: true});
        })
        .catch(next);
}

function updateLink(req, res, next) {
    const id = Number(req.params.id); //req.params.id comes back as a string
    const userID = req.user.id;
    const newdata = req.body;
    if (id === NaN) {
        // if id was not a number then throws an error (prevents SQL injections)
        const err = new Error("This is not a valid ID");
        err.status = 400;
        next(err);
    }
    updateLinkbyID(id, newdata, userID)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(next);
}

module.exports = {
    getAllLinks,
    postLink,
    removeLink,
    updateLink
};
