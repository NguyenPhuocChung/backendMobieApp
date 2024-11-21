const Calendaring = require("../models/calendaringModel");

const calendaring = async (req, res) => {
  const date = req.params.date; // Lấy tham số date từ query

  // Chuyển đổi date thành đối tượng Date
  const startDate = new Date(date); // Ngày hiện tại từ frontend
  startDate.setHours(0, 0, 0, 0); // Đặt giờ về đầu ngày

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999); // Đặt giờ về cuối ngày

  try {
    // Tìm kiếm trong cơ sở dữ liệu với startDate trong khoảng thời gian
    const calendarData = await Calendaring.find({
      startDate: { $gte: startDate, $lt: endDate },
    }).populate("createrBy");

    res.status(200).json(calendarData);
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    res.status(500).json({ error: "Failed to fetch calendar data" });
  }
};

const addCalendaring = async (req, res) => {
  const {
    title,
    description,
    startDate,
    startTime,
    endDate,
    endTime,
    link,
    status,
    createrBy,
  } = req.body;

  try {
    const newCalendaring = new Calendaring({
      title,
      description,
      startDate,
      startTime,
      endDate,
      endTime,
      link,
      status,
      createrBy,
    });

    const savedCalendaring = await newCalendaring.save();
    res.status(200).json(savedCalendaring);
  } catch (error) {
    console.error("Error creating task:", error); // Cập nhật thông báo lỗi
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateCalendaring = async (req, res) => {
  const calendaringId = req.params.id; // Lấy ID của lịch từ params
  const updatedData = req.body; // Dữ liệu mới để cập nhật

  try {
    const updatedCalendaring = await Calendaring.findByIdAndUpdate(
      calendaringId, // ID của lịch cần cập nhật
      updatedData, // Dữ liệu mới để cập nhật
      { new: true } // Trả về tài liệu đã cập nhật thay vì tài liệu cũ
    );

    if (!updatedCalendaring) {
      return res.status(404).json({ message: "Calendaring not found" });
    }

    res.status(200).json(updatedCalendaring); // Trả về lịch đã được cập nhật
  } catch (error) {
    console.error("Error updating calendaring:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Xóa một lịch làm việc theo ID
const deleteCalendaring = async (req, res) => {
  const calendaringId = req.params.id; // Lấy ID của lịch từ params

  try {
    const deletedCalendaring = await Calendaring.findByIdAndDelete(
      calendaringId
    );

    if (!deletedCalendaring) {
      return res.status(404).json({ message: "Calendaring not found" });
    }

    res.status(200).json({ message: "Calendaring deleted successfully" });
  } catch (error) {
    console.error("Error deleting calendaring:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllCalendaring = async (req, res) => {
  try {
    // Tìm kiếm trong cơ sở dữ liệu với startDate trong khoảng thời gian
    const calendarData = await Calendaring.find().populate("createrBy");
    res.status(200).json(calendarData);
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    res.status(500).json({ error: "Failed to fetch calendar data" });
  }
};
module.exports = {
  getAllCalendaring,
  calendaring,
  addCalendaring,
  deleteCalendaring,
  updateCalendaring,
};
