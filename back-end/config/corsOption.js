const allowedOrigins = require("./allowedOrigin")
const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        //add !origin -  mean block REST tools or server-to-server requests
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

module.exports = corsOptions
