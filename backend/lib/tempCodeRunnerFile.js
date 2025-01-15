import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";
dotenv.config("/Users/youngjaekim/Desktop/Linkedin_Clone/.env");
const TOKEN = process.env.MailTrap_Token;

export const mailTrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: process.env.EMAIL_FROM,
  name: process.env.NAME_FROM,
};

mailTrapClient
  .send({
    from: sender,
    to: [{ email: "lukiditto@gmail.com" }],
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error);
