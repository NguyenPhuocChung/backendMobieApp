const Meeting = require("../models/meetingModel");

// Tạo mới một cuộc họp
const createMeeting = async (req, res) => {
  const {
    title,
    description,
    organizer,
    attendees,
    date,
    time,
    duration,
    location,
  } = req.body;

  try {
    const newMeeting = new Meeting({
      title,
      description,
      organizer,
      attendees,
      date,
      time,
      duration,
      location,
    });

    await newMeeting.save();
    res.status(201).json({
      message: "Cuộc họp đã được tạo thành công",
      meeting: newMeeting,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi tạo cuộc họp", error });
  }
};

// Lấy danh sách tất cả các cuộc họp
const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.status(200).json(meetings);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy danh sách cuộc họp", error });
  }
};

// Lấy thông tin chi tiết của một cuộc họp
const getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting) {
      return res.status(404).json({ message: "Cuộc họp không tồn tại" });
    }
    res.status(200).json(meeting);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy thông tin cuộc họp", error });
  }
};

// Cập nhật một cuộc họp
const updateMeeting = async (req, res) => {
  const {
    title,
    description,
    link,
    creater,
    status,
    endTime,
    startDate,
    startTime,
    endDate,
  } = req.body;

  try {
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        link,
        creater,
        status,
        endTime,
        startDate,
        startTime,
        endDate,
      },
      { new: true } // Trả về bản ghi đã được cập nhật
    );

    if (!updatedMeeting) {
      return res.status(404).json({ message: "Cuộc họp không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật cuộc họp thành công",
      meeting: updatedMeeting,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi cập nhật cuộc họp", error });
  }
};

// Xóa một cuộc họp
const deleteMeeting = async (req, res) => {
  try {
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!deletedMeeting) {
      return res.status(404).json({ message: "Cuộc họp không tồn tại" });
    }
    res.status(200).json({ message: "Xóa cuộc họp thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi xóa cuộc họp", error });
  }
};

module.exports = {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
};
