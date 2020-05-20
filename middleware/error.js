function handleError(err, req, res, next) {
    const errorStatus = err.status || 400;
    const errorMessage = err.message || err;
    res.status(errorStatus).send({error: errorMessage});
}

module.exports = handleError;
