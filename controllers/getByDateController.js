const Calendaring = require("../models/calendaringModel");

const getEventsByDate = async (req, res) => {
  const { startDate } = req.query; // Lấy ngày từ body
  console.log("day là ", startDate);
  try {
    const events = await Calendaring.find({ startDate: startDate }); // Tìm các sự kiện theo ngày
    res.status(200).json(events); // Gửi phản hồi JSON với sự kiện
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  getEventsByDate,
};
