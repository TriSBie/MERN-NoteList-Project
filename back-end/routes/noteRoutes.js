const express = require("express");
const router = express.Router();
const noteController = require("../controller/noteController")

router.route("/")
    .get(noteController.getAllNotes)
    .post(noteController.createNewNote)
    .delete(noteController.deleteNote)
    .patch(noteController.updateNote)

module.exports = router