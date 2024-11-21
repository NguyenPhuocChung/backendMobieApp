const User = require("../models/accountModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

// Hàm gửi OTP qua email
const sendOTP = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "chungnp160902@gmail.com",
      pass: "fwbo fixz elfu arxu", // Thay bằng mật khẩu ứng dụng của bạn
    },
  });

  const mailOptions = {
    from: '"Công Ty CNHH 5 thành viên" <chungnp160902@gmail.com>',
    to, // Địa chỉ email của người dùng
    subject: "Mã OTP",
    html: `Mã OTP của bạn là: <strong>${otp}</strong>`, // Cải thiện định dạng email
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP đã được gửi thành công");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
};

// Hàm gửi email thông báo mật khẩu
const sendEmail = async (to, password) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "chungnp160902@gmail.com", // Thay bằng email của bạn
      pass: "fwbo fixz elfu arxu", // Thay bằng mật khẩu ứng dụng của bạn
    },
  });

  const mailOptions = {
    from: '"Công Ty CNHH 5 thành viên" <chungnp160902@gmail.com>',
    to,
    subject: "Thông tin tài khoản của bạn",
    html: `<p>Chào bạn,</p>
           <p>Tài khoản của bạn đã được tạo thành công.</p>
           <p><strong>Mật khẩu của bạn là: ${password}</strong></p>
           <p>Hãy đăng nhập và thay đổi mật khẩu ngay sau khi đăng nhập!</p>
           <p>Chúc bạn làm việc vui vẻ!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email đã được gửi thành công");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
};

// Hàm đăng ký người dùng
const register = async (req, res) => {
  const { role, password, email } = req.body;

  if (!role || !password || !email) {
    return res
      .status(400)
      .json({ message: "Role, password and email are required" });
  }

  try {
    // Kiểm tra xem người dùng đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }

    // Mã hóa mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({ role, password: hashedPassword, email });

    // Lưu người dùng vào cơ sở dữ liệu
    await newUser.save();

    // Gửi email thông báo mật khẩu
    await sendEmail(email, password);

    res
      .status(201)
      .json({ message: "User registered successfully", user: { role, email } });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Hàm đăng nhập
const login = async (req, res) => {
  const { email, role, password } = req.body;

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ message: "Email, role and password are required" });
  }

  try {
    // Tìm người dùng dựa trên email và role
    const user = await User.findOne({ email, role });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password or role" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password or role" });
    }

    // Nếu thành công, trả về thông báo đăng nhập thành công
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email, role: user.role },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Hàm kiểm tra mật khẩu
const checkPassword = async (req, res) => {
  const id = req.params.id;
  const { password } = req.body;

  console.log("====================================");
  console.log(`ID: ${id}, Password: ${password}`);
  console.log("====================================");

  if (!password || !id) {
    return res.status(400).json({ message: "Password and ID are required" });
  }

  try {
    // Tìm người dùng dựa trên ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password!" });
    }

    // Nếu thành công, trả về thông tin người dùng
    res.status(200).json({ user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error("Error checking password:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Hàm gửi OTP và lưu vào session
const otpPassword = async (req, res) => {
  const { email } = req.body;

  console.log(email);

  // Tạo mã OTP ngẫu nhiên 6 chữ số
  const otp = Math.floor(100000 + Math.random() * 900000);
  req.session.otp = otp; // Lưu OTP vào session

  // Gửi OTP đến email đã đăng ký
  await sendOTP(email, otp);
  res.status(200).json({ message: "OTP sent to your email!" });
};

// Hàm xác minh và cập nhật mật khẩu
const verifyAndUpdatePassword = async (req, res) => {
  const { otp, password, id } = req.body;
  const userOtp = req.session.otp; // Lấy OTP từ session

  console.log(userOtp, password, id, otp); // Logging để kiểm tra giá trị
  console.log("User OTP in session:", userOtp, typeof userOtp); // Kiểu dữ liệu của OTP trong session
  console.log("OTP entered by user:", otp, typeof otp); // Kiểu dữ liệu của OTP mà người dùng nhập vào

  try {
    // Kiểm tra OTP
    if (String(otp) !== String(userOtp)) {
      return res.status(401).json({ message: "Invalid OTP!" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cập nhật mật khẩu trong cơ sở dữ liệu
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Xóa session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Error destroying session" });
      }
    });

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error during password update:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  register,
  login,
  checkPassword,
  otpPassword,
  verifyAndUpdatePassword,
};
