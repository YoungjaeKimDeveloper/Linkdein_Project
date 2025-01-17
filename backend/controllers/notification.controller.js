import { Notification } from "../models/notification.model.js";

export const getUserNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await Notification.find({ recipient: id })
      .populate("relatedUser", "name userName profilePicture")
      .populate("relatedPost", "content image");
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("ERROR IN [getUserNotification]: ", error.message);
    return res.status(500).json({
      success: false,
      message: `ERROR IN [getUserNotification]: , ${error.message}`,
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationID = req.params.id;
    const notification = await Notification.findByIdAndUpdate(
      {
        _id: notificationID,
        recipient: req.user_id,
      },
      { read: true },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Notification updated",
    });
  } catch (error) {
    console.error("ERROR IN [markNotificationAsRead]: ", error.message);
    return res.status(500).json({
      success: false,
      message: `ERROR IN [markNotificationAsRead]: , ${error.message}`,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationID = req.params.id;
    await Notification.findOneAndDelete({
      _id: notificationID,
      recipient: req.user_id,
    });
    return res
      .status(200)
      .json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("ERROR IN [deleteNotification]", error.message);
    return res.status(500).json({
      success: false,
      message: `ERROR IN [deleteNotification] : ${error.message}`,
    });
  }
};
