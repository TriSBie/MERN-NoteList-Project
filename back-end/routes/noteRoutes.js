const express = require("express");
const router = express.Router();
const noteController = require("../controller/noteController")
const verifyJWT = require("../middleware/verifyJWT")

//apply for all routing in /notes path 
router.use(verifyJWT)

router.route("/")
    .get(noteController.getAllNotes)
    .post(noteController.createNewNote)
    .delete(noteController.deleteNote)
    .patch(noteController.updateNote)

module.exports = router