const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    file: {
      type: String, // Lưu tên file
    },
    startDate: { type: Date, required: true },
    startTime: { type: Date, required: true },
    endDate: { type: Date, required: true },
    endTime: { type: Date, required: true },
    invite: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts" },
    labels: { type: String, required: true },
    status: { type: String, required: true },
    createrBy: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts" },
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
