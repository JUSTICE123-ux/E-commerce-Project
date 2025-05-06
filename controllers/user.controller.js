import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../utils/sendMail.js";
import { sendEmail } from "../middleware/auth.js";
import newInfo from "../models/user.model.js";

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "missing details" });
  }

  try {
    const existingUser = await newInfo.findOne({ email });
    if (existingUser) {
      console.log("user already exist");
      return res.status(400).json({ message: "user already exist" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const createUser = newInfo.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      isVerified: false,
    });

    const token = jwt.sign({ id: createUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const Url = `http://localhost:4000/verify-email?token=${token}`;
    console.log(token);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      html: `
      <h2>Email Verification</h2>
      <p>Click the button below to verify your email:</p>
      <a href="${Url}" style="padding: 10px 20px; background: #007bff; color: white; text-decoration: none;">Verify Email</a>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${Url}</p>
    `,
    });
    return res.status(200).json({
      message: "Registration successful. check your email to verify",
      newInfo: email,
      firstName,
      lastName,
      password: hashPassword,
      isVerified,
    });
  } catch (error) {
    console.log(error);
  }
};

export const isVerified = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userJwt = await newInfo.findById(decoded.id);

    if (!userJwt) return res.status(404).json({ message: "User not found" });

    userJwt.isVerified = true;
    await userJwt.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Enter email and password" });
  }
  try {
    const user = await newInfo.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid Email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    console.log("login successful", user, token);
    return res.status(200).json({ message: "login successful", user , token});
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
