const mongoose = require("mongoose");

// Schema cho calendering
const calendaringSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Tiêu đề sự kiện
    description: { type: String, required: true }, // Mô tả sự kiện
    startDate: { type: Date, required: true }, // Ngày bắt đầu
    endDate: { type: Date, required: true }, // Ngày kết thúc
    startTime: { type: String, required: true }, // Thời gian bắt đầu (hh:mm)
    endTime: { type: String, required: true }, // Thời gian kết thúc (hh:mm)
    link: { type: String, required: true }, // Link sự kiện (URL)
    createrBy: { type: mongoose.Schema.Types.ObjectId, ref: "Accounts" }, // Người tạo sự kiện{ type: mongoose.Schema.Types.ObjectId, ref: "Accounts" }
    status: { type: String, required: true }, // Trạng thái (active, completed, etc.)
  },
  { timestamps: true } // Thêm createdAt và updatedAt
);

// Tạo model cho calendering
const Calendering = mongoose.model("Calendering", calendaringSchema);

module.exports = Calendering;
