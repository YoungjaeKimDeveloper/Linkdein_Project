import { mailTrapClient, sender } from "../lib/mailtrap.config.js";
import {
  createWelcomeEmailTemplate,
  createCommentNotificationEmailTemplate,
} from "./emailTemplate.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
  const recipients = [{ email }];
  try {
    await mailTrapClient.send({
      from: sender,
      to: recipients,
      html: createWelcomeEmailTemplate(name, profileUrl),
      subject: "Welcome to Our Website",
      category: "Welcome",
      //   html: <p>Helo</p>,
    });
    console.info("Email sent successfully✅");
  } catch (error) {
    console.error(`Failed to send the Welcome Email ❌: ${error.message}`);
  }
};

export const sendCommentNotificationEmail = async (
  recipientEmail,
  recipientName,
  commenterName,
  postUrl,
  commentContent
) => {
  const recipient = [{ recipientEmail }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "New comment on Your Post",
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        commentContent
      ),
      category: "comment_notification",
    });
    console.info("Comment Notification Email send successfully", response);
  } catch (error) {}
};
