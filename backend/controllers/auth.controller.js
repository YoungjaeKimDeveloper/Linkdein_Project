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
    //  사용자 정보 받아오기
    const { email, password } = req.body;
    // 모든 폼 확인하기
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Fill up the all Forms" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "CANNOT FIND THE USER WITH EMAIL" });
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }
    const token = await generateToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json({
      success: true,
      message: "Login Successfully ✅",
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(`ERROR IN LOGIN ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `ERROR IN LOGIN FUNCTION ❌ : ${error.message}`,
    });
  }
};

//   Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");
    return res
      .status(200)
      .json({ success: true, message: "USER LOGGED OUT✅" });
  } catch (error) {
    console.error("Failed to Logout ❌: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "FAILED TO LOGOUT" });
  }
};

// 현재 유저 정보 가져오기
export const getCurrentUser = async (req, res) => {
  try {
    const currentUSer = req.user;
    return res.status(200).json({ success: true, user: currentUSer });
  } catch (error) {
    console.error("FAILED TO GET USERS");
    return res.status(500).json({
      success: false,
      message: `ERROR IN [getCurrentUser] ${error.message}}`,
    });
  }
};
