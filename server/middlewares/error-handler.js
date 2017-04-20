exports.errorHandler = function () {
    return function (err, req, res, next) {
        if (err) {
            console.log(err);
            res.status(err.statusCode || 500).send(removeStatusCode(err));
        }
    };
};

function removeStatusCode(err) {
    delete err.statusCode;
    if (err.sql) {
        return { message: err.message, errors: err.errors };
    }
    return err;
}