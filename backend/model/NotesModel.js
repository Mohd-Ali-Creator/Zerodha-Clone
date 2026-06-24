const { model } = require("mongoose");

const { NotesSchema } = require("../Schemas/NotesSchema");

const NotesModel = new model("note", NotesSchema);

module.exports = { NotesModel };
