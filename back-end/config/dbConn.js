const mongoose = require("mongoose")

const connectDB = async () => {
    //When using - proceed by third-party services - must wrapped by using try-catch or express async handler
    try {
        await mongoose.connect(process.env.DATABASE_URI)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB