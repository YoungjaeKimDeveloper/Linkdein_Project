import jwt from "jsonwebtoken";

export const generateToken = async (userId) => {
  return jwt.sign({ userId }, process.env.TOEKN_SECRETKEY, {
    expiresIn: "7d",
  });
};
