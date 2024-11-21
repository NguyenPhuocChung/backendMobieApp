const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    file: {
      type: String, // Lưu tên file
    },
    startDate: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, required: true },
    endTime: { type: Date, required: true },
    invite: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts" },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    createrBy: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts" },

    // creatorId: { type: String, required: true }, // ID của người tạo
  },
  { timestamps: true }
);
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
