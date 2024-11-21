const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  memeberChat: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accounts",
    },
  ],
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
