require("dotenv").config()
const express = require("express")
const path = require("path")
const app = express()
const { logger, logEvents } = require("./middleware/logger")
const errorHandler = require("./middleware/errorHandler")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require("./config/corsOption")
const mongoose = require("mongoose")
const connectDB = require("./config/dbConn")
/**------------------------------------------------------------------------------------ */
// app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
connectDB()

app.use(logger)

// app.use(function (req, res, next) {
//     req.headers.origin = req.headers.origin || req.headers.host;
//     next();
// });
//{ credentials: true, origin: true }
app.use(cors({ credentials: true, origin: true })) //three options: options, credential, optionsSuccessStatus


// CHANGE THE CONTENT/TYPES - By default text/HTML
app.use(express.json()) // for parsing application/json

// app.use(cookieParser)
/**------------------------------------------------------------------------------------ */
//to serve static files such as images, CSS files, and Javascript files. 
//Use the express.static
app.use("/", express.static(path.join(__dirname, "/public"))); //OR we can change by app.use(express.static("public"))


//LISTEN ROOT ROUTE, , express static - global varibale nodejs will look up path public as static files in side
app.use("/", require("./routes/root"))
app.use("/auth", require("./routes/authRoutes.js"))
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes.js"));
/**------------------------------------------------------------------------------------ */
//req.accepts(types) : checks if the specified content types are acceptable, based on the request's Accept HTTP header
const PORT = process.env.PORT || 3500
/**------------------------------------------------------------------------------------ */
app.use(errorHandler);

/**------------------------------------------------------------------------------------ */
//Cath the error if the url doesn't match any routes
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        // .. mean previous directory, it would refer to view/404.html directory
        res.sendFile(path.join(__dirname, "views", "404.html"))
    } else if (req.accepts("json")) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found Page')
    }
})

//the 'once' signifies that the event will be called only once the first time the event occured
mongoose.connection.once('open', () => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
        console.log("Server is running on PORT: " + PORT)
    })
})


mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no} : ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog')
})

/**EXPLAINATIONS 
 * 
 * <> cookieParser : creare  a new cookie parser middleware function using the given secret and options
 * - secret : a string or array used for signing cookies
 * <> cors: since it refused by Access Control Allow Originm header in requested resource
*/
