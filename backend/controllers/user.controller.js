import cloudinary from "../lib/cloudinary.config.js";
import User from "../models/User.model.js";

// For the Sidebar
export const getSuggestedConnections = async (req, res) => {
  try {
    const user = req.user;
    const currentUser = await User.findById(user._id).select("connections");

    // Find users who are not alreadt connected, and also do not recommend our own profile
    const suggestedUser = await User.find({
      _id: {
        $ne: req.user._id,
        $nin: currentUser.connections,
      },
    })
    // 추천바에 보여질 상태
      .select("profilePicture userName name headline")
      .limit(3);
    return res.status(200).json({
      success: true,
      message: "Get the getSuggestedConnections ✅",
      suggestedUser: suggestedUser,
    });
  } catch (error) {
    console.error(`Failed to [getSuggestedConnections] : ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Error in [getSuggestedConnections] ${error.message}`,
    });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userName: req.params.username }).select(
      "-password"
    );
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "CANNOT FIND THE USER WITH NAME " });
    }
    return res.status(200).json({
      success: true,
      message: "getPublicProfile Successfully✅",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `ERROR IN [getPublicProfile function] ${error.message}`,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // Allow Fields
    const allowFields = [
      "userName",
      "headline",
      "about",
      "location",
      "skills",
      "experience",
      "education",
      "profilePicture",
      "bannerImg",
    ];

    const updateData = {};

    for (const field of allowFields) {
      if (req.body[field]) {
        // Key = Value
        updateData[field] = req.body[field];
      }
    }
    // todo check for the profile img and banner im => upload to cloudinary
    if (req.body.profilePicture) {
      const result = await cloudinary.uploader.upload(req.bdoy.profilePicture);
      updateData.profilePicture = result.secure_url;
    }
    if (req.body.bannerImg) {
      const result = await cloudinary.uploader.upload(req.body.bannerImg);
      updateData.bannerImg = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select("-password");
    return res
      .status(200)
      .json({ success: true, user: user, message: "User Data updated ✅" });
  } catch (error) {
    console.error("FAILED TO UPDATE USER'S Profile : ❌", error.message);
    return res
      .status(400)
      .json({ success: false, message: "FAILED TO UPDATE USER'S Profile❌" });
  }
};
