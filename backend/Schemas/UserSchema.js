const { Schema } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 100000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { UserSchema };
