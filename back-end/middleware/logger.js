const { format } = require("date-fns")
const { v4: uuid } = require("uuid")
const fileSystem = require("fs")
const fileSystemPromise = require("fs/promises")
const path = require("path")

/**---------------------------------------------------------------------------------------- */
const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`
    try {
        //check file whether exist or not fn.existsAync(path)

        if (!fileSystem.existsSync(path.join(__dirname, "..", 'logs'))) { //check does filePath Directory are already exsits ?
            //since write file asynchronous using await fileSystemPromise.mkdir(pathFile, content) - create path
            await fileSystemPromise.mkdir(path.join(__dirname, "..", "logs"))
            // Create new directory logs if doesn't exist.
        }

        //appendFile ~ overwrite file
        fileSystemPromise.appendFile(path.join(__dirname, "..", "logs", logFileName), logItem)
    } catch (error) {
        console.log(error)
    }
}
/**---------------------------------------------------------------------------------------- */

// NOTE
// fileSystem.existsSync 
// fileSystemPromise.appendFile - append to the end
// OR Write by fileSystemPromise.writeFile() - unsecure 

/**---------------------------------------------------------------------------------------- */
//CREATE MIDDLE WARE OF LOGGER
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.js")
    console.log(`${req.method} ${req.path}`) //tracking path
    next() //execute next piece of middleware chaining
}

/**---------------------------------------------------------------------------------------- */
//EXPORT MODULE
module.exports = { logger, logEvents }


/**EXPLAINATIONS
 * 
 * The system when initial running will log 2 times
 * 
 * First for static file load public folder
 * Second load route to process middleware
 * 
 */