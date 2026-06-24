const { Schema } = require("mongoose");

const AlertsSchema = new Schema({
  symbol: {
    type: String,
    required: true,
  },
  targetPrice: {
    type: Number,
    required: true,
  },
  condition: {
    type: String,
    enum: ["above", "below"],
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "triggered"],
    default: "active",
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  triggeredAt: {
    type: Date,
  },
  triggerPrice: {
    type: Number,
  }
});

module.exports = { AlertsSchema };
