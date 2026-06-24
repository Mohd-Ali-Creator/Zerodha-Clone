const { model } = require("mongoose");

const { UserSchema } = require("../Schemas/UserSchema");

const UserModel = new model("user", UserSchema);

module.exports = { UserModel };
