const mongoose = require("mongoose") //to manipulate the documents of the collection of the MongoDB database
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        default: ['Employee'] //by default
    } //using array indicates the value can have one or more values.
    , active: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema) //the name are of model are represents for Model Handling