// controllers/commentController.js
const Comment = require("../models/commentModel");
const multer = require("multer");
const path = require("path");

// Cấu hình Multer để lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "file/"); // Đường dẫn nơi lưu file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Đặt tên file
  },
});

const upload = multer({ storage });

// Controller để thêm bình luận
exports.addComment = [
  upload.single("file"), // Nhận file từ trường 'file'
  async (req, res) => {
    try {
      const { description, userId, tasksId } = req.body; // Lấy các trường từ body
      const file = req.file; // Lấy file

      // Tạo đối tượng Comment
      const newComment = new Comment({
        userId,
        tasksId,
        description,
        file: file ? file.filename : null, // Nếu có file, lưu tên file
      });

      // Lưu comment vào cơ sở dữ liệu
      await newComment.save();

      res
        .status(201)
        .json({ message: "Comment added successfully!", comment: newComment });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Error adding comment", error });
    }
  },
];

// Lấy tất cả các bình luận của một dự án
exports.getCommentsByTask = async (req, res) => {
  try {
    const tasksId = req.params.idTask; // Extract the task ID from the URL parameters
    console.log(tasksId);

    // Fetch all comments related to the given task ID, and populate relevant fields
    const comments = await Comment.find({ tasksId })
      .populate("userId", "fullName") // Populate user details with only the fullName field
      .populate({
        path: "tasksId",
        populate: {
          path: "createrBy", // Populate the 'createrBy' field within the 'tasksId'
          select: "fullName", // Select only the 'fullName' field from 'Account'
        },
      });

    console.log("Retrieved comments successfully.");
    res.status(200).json(comments); // Return the comments found
    console.log(comments);
  } catch (error) {
    console.error("Error retrieving comments:", error);
    res.status(500).json({ message: "Server error." });
  }
};

// Cập nhật bình luận
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { contentComment } = req.body;

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { contentComment },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Error updating comment", error });
  }
};

// Xóa bình luận
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
  }
};
