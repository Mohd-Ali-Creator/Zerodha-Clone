const { model } = require("mongoose");

const { AlertsSchema } = require("../Schemas/AlertsSchema");

const AlertsModel = new model("alert", AlertsSchema);

module.exports = { AlertsModel };
