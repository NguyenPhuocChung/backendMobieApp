// controllers/messageController.js
const Message = require("../models/chatModel");

// Lưu tin nhắn
const saveMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error saving message", error });
  }
};

// Lấy tin nhắn theo groupId
const getMessagesByGroupId = async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await Message.find({ groupId }).populate("senderId");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};

module.exports = {
  saveMessage,
  getMessagesByGroupId,
};
