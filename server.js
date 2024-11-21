const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors
const authRoutes = require("./routes/authRoutes");
const meetingRoutes = require("./routes/authRoutes");
const addTask = require("./routes/authRoutes");
const bodyParser = require("body-parser"); // nếu bạn sử dụng body-parser
const URL = require("./middlewares/authMiddleware");
const app = express();
const path = require("path");
const session = require("express-session");
app.use(
  session({
    secret: "your-secret-key", // Thay bằng khóa bí mật của bạn
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Nếu sử dụng HTTPS, hãy đặt thành true
  })
);

// const { findAccountsById } = require("./controllers/accountController");
// const accountController = require("./controllers/accountController");
// Cấu hình CORS
const corsOptions = {
  origin: [
    `http://${URL.BASE_URL}:5000`, // Địa chỉ IP của ứng dụng Expo (có thể thay đổi)
  ], // Chỉ cho phép domain này
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức cho phép
  credentials: true, // Cho phép gửi cookie
};
app.use(cors(corsOptions)); // Sử dụng middleware CORS với tùy chọn
app.use(express.json());
//
mongoose
  .connect("mongodb://localhost:27017/manage_project_system")
  .then(() => console.log("Kết nối đến MongoDB thành công!"))
  .catch((error) => console.error("Lỗi kết nối:", error));
//
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/file", express.static(path.join(__dirname, "file")));

app.use("/api/auth", authRoutes);
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
