const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const asyncHandler = require("express-async-handler")

dotenv.config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    const token = authHeader.split(' ')[1]; //get the token by splitting string authentication code

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    message: "Forbidden"
                })
            }

            //set infomation in request
            req.user = decoded.UserInfo.username
            req.roles = decoded.UserInfo.roles
            next()
        })
    )
}

module.exports = verifyJWT