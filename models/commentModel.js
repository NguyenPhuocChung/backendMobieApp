// models/commentModel.js
const mongoose = require("mongoose");

// Định nghĩa schema cho Comment
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Accounts", // Liên kết với mô hình User
    },
    tasksId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Task", // Liên kết với mô hình Task
    },
    description: {
      type: String,
      required: true,
    },
    file: {
      type: String, // Lưu tên file
    },
  },
  {
    timestamps: true, // Tự động thêm trường createdAt và updatedAt
  }
);

// Tạo mô hình Comment từ schema
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
