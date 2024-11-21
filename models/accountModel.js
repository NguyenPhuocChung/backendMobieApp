const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  avatar: {
    type: String,
    default: "", // Set a default value if needed
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure unique emails
  },
  fullName: {
    type: String,
    default: "", // Set a default value if needed
  },
  birthDate: {
    type: Date, // Consider using Date type for birthDate for consistency
  },
  address: {
    type: String,
    default: "", // Set a default value if needed
  },
  phone: {
    type: String,
    default: "", // Set a default value if needed
  },
  position: {
    type: String,
    default: "", // Set a default value if needed
  },
  department: {
    type: String,
    default: "", // Set a default value if needed
  },
  startDate: {
    type: Date,
    default: Date.now, // Set default to current date
  },
});

// Create the Account model from the schema
const Accounts = mongoose.model("Accounts", accountSchema);

module.exports = Accounts;
