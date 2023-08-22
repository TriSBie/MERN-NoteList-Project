const rateLimit = require("express-rate-limit")
const { logEvent } = require("./logger")

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // store: ... , // Use an external store for more precise rate limiting
    message: {
        message: 'Too many login attempts from this IP, please try again after a 60 seconds', pause
    },
    handler: (req, res, next, options) => {
        logEvent(`Too Many Request: ${options.message.message}\t${req.method}\t${req.url}\t
        ${req.headers.origin}`, `errorLog.log`)
        res.status(options.statusCode).send(options.message)
    }
})

module.exports = loginLimiter