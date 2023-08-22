const { loggerEvents, logEvents } = require("../logs/logger")

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t ${req.method}\t${req.url}\t
    ${req.headers.origin}`, 'errLog.log')
    //Response to the server

    const status = res.statusCode ? res.statusCode : 500 // server error
    res.status(status).json({
        message: err.message
    })
}

module.exports = errorHandler