const modelExample = require("../model/examples-model");

function getAllExamples(req, res, next) {
    modelExample
        .getAllExamples()
        .then(example => res.send(example))
        .catch(next);
}

// Inserts a new example into the examples table and returns the inserted row's id
function postExample(req, res, next) {
    req.body.user_id = req.user.id;
    req.body.admin = req.user.admin;
    modelExample
        .createExample(req.body)
        .then(exampleId => {
            res.status(201).send({
                exampleId: exampleId
            });
        })
        .catch(next);
}

function deleteExample(req, res, next) {
    modelExample
        .deleteExample(req.params.id, req.user)
        .then(() => {
            res.status(200).send({deleted: true});
        })
        .catch(next);
}

function getExample(req, res, next) {
    const id = req.params.id;
    modelExample
        .getExample(id)
        .then(result => {
            console.log(!result === undefined);
            if (!result) {
                res.status(204).send("Error: Resource not found");
            }
            res.status(200).send(result);
        })
        .catch(next);
}

function updateExample(req, res, next) {
    const id = Number(req.params.id); //req.params.id comes back as a string
    const userID = req.user.id;
    const newdata = req.body;
    if (id === NaN) {
        // if id was not a number then throws an error (prevents SQL injections)
        const err = new Error("This is not a valid ID");
        err.status = 401;
        next(err);
    }

    modelExample
        .updateExamplebyID(id, newdata, userID)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(next);
}

module.exports = {
    getAllExamples,
    postExample,
    getExample,
    deleteExample,
    updateExample
};
