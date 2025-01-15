import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ success: false, message: "NO TOKEN ❌" });
    }

    const decode = jwt.verify(token, process.env.TOEKN_SECRETKEY);
    if (!decode) {
      return res
        .status(401)
        .json({ success: false, message: "FAILED TO DECODE" });
    }
    const verifiedUser = await User.findById(decode.userId).select("-password");
    if (!verifiedUser) {
      return res
        .status(400)
        .json({ success: false, message: "FAILED tO find verifiedUser" });
    }
    req.user = verifiedUser;
    next();
  } catch (error) {
    console.error(`ERROR IN [verifiedUser]: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `ERROR IN [verifiedUser]: ${error.message}`,
    });
  }
};
