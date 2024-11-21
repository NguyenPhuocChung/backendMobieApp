const Accounts = require("../models/accountModel");
const Project = require("../models/addProjectModel"); // Import model dự án
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

const addProject = [
  upload.single("file"),
  async (req, res) => {
    console.log("Request Body:", req.body);

    try {
      if (!req.body.data) {
        return res
          .status(400)
          .json({ message: "Missing project data in request body" });
      }

      let projectData;
      try {
        projectData = JSON.parse(req.body.data); // Parse JSON data from formData
      } catch (parseError) {
        console.error("Error parsing project data:", parseError);
        return res
          .status(400)
          .json({ message: "Invalid JSON format for project data" });
      }

      console.log("Parsed Project Data:", projectData);

      // Create a new project object
      const newProject = new Project({
        ...projectData,
        file: req.file ? req.file.filename : null, // Add file path if a file is uploaded
      });

      // Save the project to the database
      const savedProject = await newProject.save();
      res.status(201).json(savedProject);
    } catch (error) {
      console.error("Error creating project:", error); // Log error for debugging
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
];

const findProject = async (req, res) => {
  try {
    const allProject = await Project.find()
      .populate("createrBy", "fullName")
      .populate("invite"); // Lấy fullName từ Accounts
    res.status(200).json(allProject); // Gửi phản hồi JSON với tất cả dự án
    console.log(JSON.stringify(allProject, null, 2));
  } catch (error) {
    console.error("Error fetching projects:", error); // In lỗi ra console
    res.status(500).json({ message: "Server error" });
  }
};

// Hàm cập nhật dự án bằng ID
const updateProjectById = async (req, res) => {
  const id = req.params.id; // Lấy id từ params
  const updateData = req.body; // Dữ liệu cần cập nhật

  try {
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true } // Tùy chọn để trả về tài liệu đã cập nhật và chạy các trình xác thực
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" }); // Nếu không tìm thấy dự án
    }

    res.status(200).json(updatedProject); // Trả về dự án đã cập nhật
  } catch (error) {
    console.error("Error updating project:", error);
    res
      .status(500)
      .json({ message: "Error updating project", error: error.message }); // Trả về lỗi
  }
};

// Hàm xóa dự án bằng ID
const deleteProjectById = async (req, res) => {
  const id = req.params.id; // Lấy id từ params

  try {
    const deletedProject = await Project.findByIdAndDelete(id); // Sử dụng findByIdAndDelete

    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" }); // Nếu không tìm thấy dự án
    }

    res.status(200).json({ message: "Project deleted successfully" }); // Thông báo xóa thành công
  } catch (error) {
    console.error("Error deleting project:", error);
    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message }); // Trả về lỗi
  }
};

const findProjectById = async (req, res) => {
  const id = req.params.id; // Lấy ID từ params
  try {
    const project = await Project.findById(id)
      .populate("createrBy", "fullName")
      .populate("invite", "fullName"); // Lấy fullName từ Accounts
    console.log(project);

    if (!project) {
      return res.status(404).json({ message: "Project not found" }); // Nếu không tìm thấy dự án
    }

    res.status(200).json(project); // Trả về dự án tìm được
  } catch (error) {
    console.error("Error fetching project:", error); // In lỗi ra console
    res.status(500).json({ message: "Server error" });
  }
};
// Controller lấy project theo ID invite
const getProjectsByInvite = async (req, res) => {
  const inviteId = req.params.inviteId; // Lấy invite ID từ URL params

  try {
    // Tìm tất cả các project có invite chứa inviteId
    const projects = await Project.find({ invite: inviteId })
      .populate("createrBy", "fullName")
      .populate("invite", "fullName");

    if (!projects || projects.length === 0) {
      return res
        .status(404)
        .json({ message: "No projects found for this invite." });
    }

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects by invite:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch projects." });
  }
};

// Controller để cập nhật chỉ status của task
const updateProjectStatus = async (req, res) => {
  const { id } = req.params; // ID project từ params
  const { status } = req.body; // Status mới
  console.log("====================================");
  console.log(id, status);
  console.log("====================================");
  try {
    const updatedTask = await Project.findByIdAndUpdate(
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

// Controller để lấy tổng số lượng của các trạng thái 'Ongoing', 'Not Started' và 'Progress'
const getStatusSummary = async (req, res) => {
  try {
    // Sử dụng MongoDB aggregation để đếm số lượng theo trạng thái
    const statusSummary = await Project.aggregate([
      {
        $match: {
          status: { $in: ["Ongoing", "Not started", "Done"] },
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
      ongoing: 0,
      notStarted: 0,
      Done: 0,
    };

    // Duyệt qua các kết quả và cập nhật tổng số lượng theo từng trạng thái
    statusSummary.forEach((item) => {
      if (item._id === "Ongoing") {
        result.ongoing = item.count;
      } else if (item._id === "Not started") {
        result.notStarted = item.count;
      } else if (item._id === "Done") {
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
  getStatusSummary,
  updateProjectStatus,
  addProject,
  findProject,
  updateProjectById,
  deleteProjectById,
  findProjectById,
  getProjectsByInvite,
};
