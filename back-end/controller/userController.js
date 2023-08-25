const User = require("../models/User")
const Note = require("../models/Note")
const bcrypt = require("bcrypt") //hash passsword before add into collection of database model
const asyncHandler = require("express-async-handler")
const mongoose = require("mongoose");

//@desc GET all users
//@route GET /users
//@access private


const getAllUser = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    //all methods/ services manilpulate with mongoose would be async-await flow
    const users = await User.find({}).exec() //select all fields except password, signtax by "-field" (1)
    //.select("-password").lean();
    if (!users?.length) { //find() return an array
        return res.status(400).json({
            message: 'No user found'
        })
    } //no need return statement since the return has been executed if errors occured
    return res.status(200).json(users);
})

//@desc Create new user
//@route POST /users
//@access private
const createNewUser = asyncHandler(async (req, res) => {
    //get information from Request Body
    const { username, password, roles } = req.body;

    console.log(username, password, roles)
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }


    //Check for duplicate
    const duplicate = await User.findOne({ username }); //(2)
    console.log(duplicate);
    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate username' })
    }
    const hashPassword = await bcrypt.hash(password, 10); //10 is recommended - salt-rounds (cost-factor)
    console.log(hashPassword)
    const userObject = { username, "password": hashPassword, roles } //must parse to JSON
    const user = await User.create(userObject);
    //CHECK IF CREATED SUCCESSFULLY
    if (user) {
        return res.status(201).json({
            message: `New user ${username} created`
        })
    } else { //prevent the system create operations fails
        return res.status(400).json({
            message: 'Invalid user'
        })
    }
})

//@desc Update user
//@route PATCH /users
//@access private

const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password, roles, active } = req.body;
    //all fields in request body are string - we can also parse JSON like JSON,parse(str)
    if (!id || !username || !password || !Array.isArray(roles) || !roles.length || typeof (active) !== "boolean") {
        return res.status(400).json({
            message: 'All fields are mandatory'
        })
    }

    const user = User.findById(id).exec(); //not using lean since this function may using then with other purposes

    if (!user) {
        return res.status(400).json({
            message: 'User not found'
        })
    }

    // Check for duplicate
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(400).json({
            message: 'Duplicated username'
        })
    }

    user.username = username;
    user.roles = roles;
    //create new update password with hasshing
    if (password) {
        const hashPassword = bcrypt.hash(password, 10);
        user.password = hashPassword
    }

    const updateUser = await User.replaceOne({ _id: id }, { username, password, roles, active })
    //return a promise, if save() succeeds, the promise resolves otherwide throw DocumentNotFoundError
    return res.status(201).json({
        message: `${updateUser.username} updated`
    })

})


//@desc Delete user
//@route DELETE /users
//@access private

const deleteUser = asyncHandler(async (req, res) => {
    const id = req.body;
    const objectID = new mongoose.Types.ObjectId(id)
    if (!id) {
        return req.status(400).json({
            message: 'ID\'s of User Deletion is required '
        })
    }
    //Check the note are assigned to specific users - if exists notes => not able to delete the user
    const note = await Note.findOne({ user: id }).lean().exec();
    if (note) {
        return res.status(400).json({
            message: 'User has assigned notes'
        })
    }
    const user = await User.findById(objectID).lean().exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    //DELETE USER
    const result = await User.findByIdAndDelete(objectID);
    if (result) {
        const reply = `Username ${result.username} with ID ${objectID} deleted`
        return res.status(200).json({
            message: reply
        })
    } else {
        return res.status(400).json({
            message: 'Delete user failed'
        })
    }
})


module.exports = { getAllUser, createNewUser, updateUser, deleteUser }

/** EXPLAINATIONS
 * <> Each of queries function in Mongoose return a mongoose Query object
 *
 * (1) Why using Lean : By df, mongoose queries return an instance of Mongoose Document Class - much heavier
 * => using lean skip initiating a full Mongoose document and give u POJO (*1)
 *
 * - (*1) POJO (plan old java object) :
 *  + can't extends other class
 *  + can't implement other
 *  + no requires third-party libraries
 *  + no getter, setter operations
 * - JavaBean must be :
 *  + No-args constructor
 *  + properties must be private
 *  + public getters and setters
 *  + must be serializable
 * (2) What does the exec function do ?
 * => exec() will return a promise if no callback is provided.
 * -----------------------------------------------------------------------------------------------------------------
 * Query and Params
 * <> Annotation of Query: req.query
 * - Query params is a query string - part of a URL after the question mark (?)
 * - Get query params by the Request Object: req.query.'field'
 * <> Annotation of Params: req.params
 * - Example : app.get(route[/tag/:id])
 *  + get params id by req.params.id since params return an object with key and values
 *
 */