const { validationResult } = require('express-validator');

class ValidationError {
    constructor(message) {
        this.error = new Error(message)
    }
}

class ConflictError {
    constructor(message) {
        this.error = new Error(message)
    }
}

function validationHandler(req, res, next) {
    const errors = validationResult(req)
    if (!(errors.isEmpty())) {
        console.log(errors)
        const map = errors.errors;
        let message = "Validation failed: \n"
        map.forEach(e => {
            message = message + e.param + " : " + e.msg + "\n"
        });
        throw new ValidationError(message)
    }
    next()
}
// const invalidPathHandler = (req, res, next) => {
//     res.redirect('/api/error')
// }
function errorsHandler(err, req, res, next) {

    if (err.code === "SQLITE_CONSTRAINT") {
        console.log(`ValidationError: ${err.message}`)
        res.status(422).send(err.message)
        return;
    }

    if (err instanceof ValidationError) {
        console.log(`ValidationError: ${err.error.message}`)
        res.status(422).send(err.error.message)
        return;
    }

    if (err instanceof ConflictError) {
        console.log(`ConflictError: ${err.error.message}`)
        res.status(409).send(err.error.message)
        return;
    }

    console.log(err)
    res.status(req.method == "GET" ? 500 : 503).send('Something broke!')
}

module.exports = {
    errorsHandler,
    validationHandler,
    ValidationError,
    ConflictError,
    // invalidPathHandler
};