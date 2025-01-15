import { mailTrapClient, sender } from "../lib/mailtrap.config.js";
import { createWelcomeEmailTemplate } from "./emailTemplate.js";

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
