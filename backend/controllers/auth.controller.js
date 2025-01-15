import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
// Email Handlers
import { sendWelcomeEmail } from "../emails/emailHandlers.js";
// 회원가입 기능
export const signup = async (req, res) => {
  try {
    const { name, userName, email, password } = req.body;
    if (!name || !userName || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Fill up the all forms" });
    }
    // 비밀번호 길이 체크
    if (password.length < 6) {
      return req.status(400).json({
        success: false,
        message: "Password Should be at least 6 letters",
      });
    }
    // 이메일 중복 확인
    const existedEmail = await User.findOne({ email: email });
    if (existedEmail) {
      return res.status(400).json({ success: false, message: "Email Existed" });
    }
    // 이름 중복 확인
    const existedUserName = await User.findOne({ userName: userName });
    if (existedUserName) {
      return res
        .status(400)
        .json({ success: false, message: "Please user other name" });
    }
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      userName,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    const token = await generateToken(newUser._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // 가입하고 URL 보내주기
    const profileURL = process.env.CLIENT_URL + "/profile/" + newUser.userName;
    try {
      await sendWelcomeEmail(newUser.email, newUser.name, profileURL);
    } catch (error) {
      console.error("FAIELD TO SEND EMAIL ", error.message);
    }

    return res.status(201).json({
      message: "New User Created Successfully ✅",
      newUser: {
        name: newUser.name,
        userName: newUser.userName,
        email: newUser.email,
      },
    });
    // Send Welcome Eamil
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `SERVER ERROR IN signup: ${error.message}`,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
  } catch (error) {}
};

//   Logout
export const logout = async (req, res) => {
  try {
  } catch (error) {}
};
