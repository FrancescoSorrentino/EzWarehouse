function logRequests(req, res, next) {
    console.log(`URL:\t ${req.url}`)
    console.log(`Method:\t ${req.method}`)
    console.log('Body:\t', req.body)
    next()
}

module.exports = {
    logRequests
};