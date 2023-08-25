const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const dotenv = require("dotenv")

dotenv.config()
// @desc Login
// @route POST /auth
// @access Public

const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({
            message: 'All fields are required'
        })
    }
    const foundUser = await User.findOne({ username }).exec()
    if (!foundUser || !foundUser.active) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    //jwt.sign(data, secretCode, expiresTime)
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '15m'
        }
    )

    const refreshToken = jwt.sign(
        {
            "username": foundUser.username
        }, //the data are represents in encoded
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '7d'
        }
    )
    //Create secure cookie with refresh token and push in cookies storage
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        // secure: true,
        // sameSite: 'none', //cross-site cookie- prevent malicious executable scripts into the code
        maxAge: 7 * 24 * 60 * 60 * 1000
    }).json({
        accessToken
    })
})


// @desc Refresh
// @route POST /auth/refresh
// @access Public

const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    console.log(cookies.jwt)
    //send error if user haven't logged in yet.
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized - Missing jwt token' })

    const refreshToken = cookies?.jwt

    //verify cookie give is matches with the secret is being stored or not ? 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            //if doesn't match -> send back with Forbidden
            if (err) return res.status(403).json({
                message: 'Forbidden'
            })

            //find username - cannot cast decoded.username inside, must includes pair key and value of being search.
            const foundUser = await User.findOne({ username: decoded.username }).exec();
            if (!foundUser) return res.status(401).json({
                message: 'Unauthorized'
            })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '15m'
                }
            )
            return res.json({
                accessToken
            })
        })
    )
})


// @desc Logout
// @route POST /auth/logout
// @access Public - clear cookies if exists

const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    console.log(cookies)
    if (!cookies?.jwt) return res.status(204).json({ //No content
        message: 'No Content'
    })

    return res.clearCookie('jwt', {
        httpOnly: true,
        // sameSite: 'none',
        // secure: true
    }).json({ message: 'Cookie cleared' })
})

module.exports = { login, refresh, logout }