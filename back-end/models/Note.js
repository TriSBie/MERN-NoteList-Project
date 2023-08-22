const mongoose = require("mongoose") //to manipulate the documents of the collection of the MongoDB database
const AutoIncrement = require("mongoose-sequence")(mongoose)
// [] - Note are assigned to specific users
// [] - Note have a ticket #, title, note body, created & updated dates.
// [] - Note are either OPEN or COMPLETED


const noteSchema = new mongoose.Schema({
    user: { //refer to user Object id
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User' //reference to the schema which assigned user where it came from
    },
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        default: 'Employee'
    }
    , completed: { //default should be false, when first created, a note may not be complete
        type: Boolean,
        default: false
    },
}, {
    timestamps: true //created at & updated at in realtime line
})

// noteSchema.plugin(AutoIncrement,
//     {
//         inc_field: 'ticket', //field name
//         id: 'ticketNums',//must specifies the id - separtes to the orther auto increment
//         start_seq: 500
//     })
module.exports = mongoose.model('Note', noteSchema)