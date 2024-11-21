const Task = require("../models/addTaskModels"); // Import model dự án
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "file/"); // Đường dẫn nơi lưu file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Đặt tên file
  },
});
const upload = multer({ storage });
// Hàm thêm tác vụ

const addTask = [
  upload.single("file"),
  async (req, res) => {
    console.log("Request Body:", req.body);

    try {
      if (!req.body.data) {
        return res
          .status(400)
          .json({ message: "Missing project data in request body" });
      }

      let taskData;
      try {
        taskData = JSON.parse(req.body.data); // Parse JSON data from formData
      } catch (parseError) {
        console.error("Error parsing project data:", parseError);
        return res
          .status(400)
          .json({ message: "Invalid JSON format for project data" });
      }

      console.log("Parsed Project Data:", taskData);

      // Create a new project object
      const newTask = new Task({
        ...taskData,
        file: req.file ? req.file.filename : null, // Add file path if a file is uploaded
      });

      // Save the project to the database
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
    } catch (error) {
      console.error("Error creating project:", error); // Log error for debugging
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
];

// Hàm tìm tất cả tác vụ
const findAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("invite");
    // Lấy tất cả các tác vụ
    res.status(200).json(tasks); // Trả về danh sách tác vụ
    console.log(tasks); // In danh sách tác vụ ra màn hình
  } catch (error) {
    console.error("Error finding tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const findAllTasksById = async (req, res) => {
  try {
    const id = req.params.id;
    const tasks = await Task.findById(id)
      .populate("invite", "fullName")
      .populate("createrBy", "fullName");

    // Lấy tất cả các tác vụ
    res.status(200).json(tasks); // Trả về danh sách tác vụ
    console.log(tasks); // In danh sách tác vụ ra màn hình
  } catch (error) {
    console.error("Error finding tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//
const deleteTasksById = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const tasks = await Task.findByIdAndDelete(id);
    // Lấy tất cả các tác vụ
    res.status(200).json(tasks); // Trả về danh sách tác vụ
    console.log(tasks); // In danh sách tác vụ ra màn hình
  } catch (error) {
    console.error("Error finding tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const updateTasksById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updatedData = req.body; // dữ liệu cập nhật từ yêu cầu
    const updatedTask = await Task.findByIdAndUpdate(
      taskId, // ID của tài liệu cần cập nhật
      updatedData, // Dữ liệu cập nhật
      { new: true } // Trả về tài liệu đã cập nhật thay vì tài liệu cũ
    );
    // Lấy tất cả các tác vụ
    res.status(200).json(updatedTask); // Trả về danh sách tác vụ
    console.log(updatedTask); // In danh sách tác vụ ra màn hình
  } catch (error) {
    console.error("Error finding tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
//
const findAllTasksByProjectId = async (req, res) => {
  const { projectId } = req.params; // Lấy projectId từ params
  try {
    const tasks = await Task.find({ projectId })
      .populate("invite")
      .populate("createrBy"); // Chỉnh sửa để tìm theo projectId
    res.status(200).json(tasks); // Trả về danh sách tác vụ
    console.log("====================================");
    console.log(tasks);
    console.log("====================================");
  } catch (error) {
    console.error("Error finding tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getTasksByInvite = async (req, res) => {
  const inviteId = req.params.inviteId; // Lấy invite ID từ URL params

  try {
    // Tìm tất cả các project có invite chứa inviteId
    const TaskS = await Task.find({ invite: inviteId })
      .populate("createrBy", "fullName")
      .populate("invite", "fullName");

    if (!TaskS || TaskS.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this invite." });
    }

    res.status(200).json(TaskS);
  } catch (error) {
    console.error("Error fetching projects by invite:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch projects." });
  }
};

//
const updateTaskStatus = async (req, res) => {
  const { id } = req.params; // ID project từ params
  const { status } = req.body; // Status mới
  console.log("====================================");
  console.log(id, status);
  console.log("====================================");
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" }); // Trả về lỗi nếu không tìm thấy task
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
//
const getTaskStatusSummary = async (req, res) => {
  try {
    // Sử dụng MongoDB aggregation để đếm số lượng theo trạng thái
    const statusSummary = await Task.aggregate([
      {
        $match: {
          status: { $in: ["Done", "Not started", "Ongoing"] },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Tạo object kết quả tổng hợp các trạng thái
    const result = {
      done: 0,
      notStarted: 0,
      ongoing: 0,
    };

    // Duyệt qua các kết quả và cập nhật tổng số lượng theo từng trạng thái
    statusSummary.forEach((item) => {
      if (item._id === "Done") {
        result.ongoing = item.count;
      } else if (item._id === "Not started") {
        result.notStarted = item.count;
      } else if (item._id === "Ongoing") {
        result.progress = item.count;
      }
    });

    // Trả về kết quả dưới dạng JSON
    res.status(200).json(result);
    console.log("====================================");
    console.log(result);
    console.log("====================================");
  } catch (error) {
    console.error("Error fetching status summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getTaskStatusSummary,
  updateTaskStatus,
  addTask,
  findAllTasks,
  findAllTasksById,
  deleteTasksById,
  updateTasksById,
  findAllTasksByProjectId,
  getTasksByInvite,
}; // Xuất tất cả các hàm
