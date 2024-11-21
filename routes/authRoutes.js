const express = require("express");
const { createMeeting } = require("../controllers/meetingController");
const {
  addProject,
  findProject,
  deleteProjectById,
  updateProjectById,
  findProjectById,
  getProjectsByInvite,
  updateProjectStatus,
  getStatusSummary,
} = require("../controllers/projectController");
const {
  addTask,
  findAllTasks,
  deleteTasksById,
  updateTasksById,
  findAllTasksById,
  findAllTasksByProjectId,
  getTasksByInvite,
  updateTaskStatus,
  getTaskStatusSummary,
} = require("../controllers/taskController");
const {
  login,
  register,
  checkPassword,
  otpPassword,
  verifyAndUpdatePassword,
} = require("../controllers/authController");
const {
  calendaring,
  addCalendaring,
  updateCalendaring,
  deleteCalendaring,
  getAllCalendaring,
} = require("../controllers/calenderingController");
const {
  findAccountsById,
  updateAccountsById,
  findAccounts,
  uploadAvatar,
} = require("../controllers/accountController");
const {
  getCommentsByTask,
  addComment,
} = require("../controllers/commentController");
const app = express();
const {
  findAccountsByRole,
  findAccountsByLeaderRole,
  findAccountsByMemberRole,
  deleteAccountById,
} = require("../controllers/accountController");
// Route đăng nhập
const router = express.Router();
router.post("/login", login);
router.post("/create", createMeeting);
//
router.post("/addTask", addTask);
router.get("/tasks", findAllTasks);
router.get("/taskById/:id", findAllTasksById);
router.get("/taskByIdProject/:projectId", findAllTasksByProjectId);
router.get("/tasksByInvite/:inviteId", getTasksByInvite);
router.put("/task/:id/status", updateTaskStatus); // Sử dụng PATCH cho việc cập nhật một phần

router.delete("/deleteTask/:id", deleteTasksById);
router.put("/updateTask/:id", updateTasksById);
router.get("/task/status-summary", getTaskStatusSummary);

//
router.post("/addProject", addProject);
router.delete("/deleteProject/:id", deleteProjectById);
router.put("/updateProject/:id", updateProjectById);
router.get("/projectsByInvite/:inviteId", getProjectsByInvite);
router.put("/project/:id/status", updateProjectStatus); // Sử dụng PATCH cho việc cập nhật một phần
router.get("/project/status-summary", getStatusSummary);

//
router.get("/calendering/:date", calendaring);
router.get("/getAllCalendering", getAllCalendaring);

router.post("/addCalendaring", addCalendaring);
router.delete("/deleteCalendaring/:id", deleteCalendaring);
router.put("/updateCalendaring/:id", updateCalendaring);

//
router.get("/projects", findProject);
router.get("/projectsById/:id", findProjectById);
//
router.get("/invitemember/:userRole", findAccountsByRole);
router.get("/account/:id", findAccountsById);
router.get("/allaccount", findAccounts);
router.put("/upload/:id", uploadAvatar);

//
router.post("/register", register);
router.delete("/deleteAccount/:id", deleteAccountById);
router.put("/account/:id", updateAccountsById);
router.post("/checkPassword/:id", checkPassword);
router.post("/sendOTP", otpPassword);
router.post("/verifyOtp", verifyAndUpdatePassword);

//
// router.post("/addComment", createComment);
router.get("/comment/:idTask", getCommentsByTask);
router.post("/addComment", addComment);

module.exports = router;
