const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  organizer: {
    // người tổ chức cuộc họp
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attendees: [
    {
      // danh sách thành viên tham gia
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  duration: {
    // thời gian cuộc họp (phút)
    type: Number,
    required: true,
  },
  location: {
    type: String, // địa điểm hoặc đường link cho cuộc họp trực tuyến
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});
const Meeting = mongoose.model("Meeting", MeetingSchema);

module.exports = Meeting;
