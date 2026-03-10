import user from "../models/auth.js";
import comparePassword from "../middilwares/comparePassword.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import generateToken from "../middilwares/generateToken.js";

import { OAuth2Client } from "google-auth-library";
import { parseTemplate } from "../utils/parseTemplate.js";
// import { emailQueue } from "../utils/emailQueue.js";
const accessOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 30 * 60 * 1000,
};
const refreshOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 15 * 24 * 60 * 60 * 1000,
};
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const register = async (req, res) => {
  try {
    const { FullName, Email, Password } = req.body;
    if (!FullName || !Email || !Password) {
      return res.status(300).json({
        message: "All Fileds are required",
      });
    }
    const existUser = await user.findOne({ Email });
    if (existUser) {
      return res.status(300).json({
        message: "User already exist!",
      });
    }
    const newUSer = new user({ Email, FullName, Password });
    const hasedPassword = await bcrypt.hash(Password, 10);
    newUSer.Password = hasedPassword;
    await newUSer.save();

    const payload = {
      FullName: newUSer.FullName,
      _id: newUSer._id,
      role: newUSer.role,
      subscription: {
        Id: null,
        Status: "expire",
        ExpireAt: null,
      },
    };

    const { accessToken, refreshToken } = generateToken(payload);
    res.cookie("refreshToken", refreshToken, refreshOptions);
    res.cookie("accessToken", accessToken, accessOptions);
    return res.status(200).json({
      message: payload,
      accessToken: accessToken,
    });
  } catch (err) {
    return res.status(300).json({
      message: "Something went wrong !",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(3001).json({
        message: "All Fileds are required",
      });
    }
    const response = await user.findOne({ Email: Email });
    if (!response) {
      return res.status(301).json({
        message: "User not register please register",
      });
    }
    const isCorrectPassword = await comparePassword(
      Password,
      response.Password,
    );
    if (!isCorrectPassword) {
      res.status(301).json({
        message: "Invalid password",
      });
    }
    const payload = {
      FullName: response.FullName,
      _id: response._id,
      role: response.role,
      subscription: response?.subscription,
    };

    const { accessToken, refreshToken } = generateToken(payload);
    res.cookie("refreshToken", refreshToken, refreshOptions);
    res.cookie("accessToken", accessToken, accessOptions);

    return res.status(200).json({
      message: payload,
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(301).json({
      message: "Something went wrong !",
    });
  }
};

export const googleAuth = async (req, res) => {
  const { token } = req.body;
  try {
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, email, name: googleName } = ticket.getPayload();

    let existUser = await user.findOne({
      $or: [{ Email: email }, { googleId: googleId }],
    });
    if (!existUser) {
      // Create new user if they don't exist
      existUser = await user.create({
        Email: email,
        FullName: googleName || email.split("@")[0],
        googleId: googleId,
        // Since Google auth implies identity verification, password isn't strictly necessary for login
        // But we provide a random placeholder since standard registration requires it
        Password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
      });
    } else if (!existUser.googleId) {
      // Link Google ID if user already exists via email but hasn't linked Google yet
      existUser.googleId = googleId;
      await existUser.save();
    }

    const { _id, Email, role, subscription, FullName } = existUser;

    // Generate JWTs
    const { accessToken, refreshToken } = generateToken({
      Email,
      role,
      subscription,
      FullName,
      _id,
    });

    // Send tokens in HTTP-only cookies
    res.cookie("accessToken", accessToken, accessOptions);
    res.cookie("refreshToken", refreshToken, refreshOptions);
    res.status(200).json({
      message: { _id, Email, role, subscription, FullName },
      accessToken,
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid Google token" });
  }
};

export const searchUser = async (req, res) => {
  try {
    let { value } = req.query;
    value = value.trim();

    const query = isEmail(value)
      ? { email: value.toLowerCase() }
      : { fullName: value };

    const existingUser = await user.find(query);

    res.status(200).json({ message: existingUser });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

export const createSubAdmin = async (req, res) => {
  try {
    let { _id } = req.body;
    const existingUser = await user.findByIdAndUpdate(
      _id,
      {
        $set: { role: "subAdmin" },
      },
      { new: true },
    );

    res.status(200).json({ message: existingUser });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

export const SubAdmins = async (req, res) => {
  try {
    const subAdmin = await user.find({ role: "subAdmin" });
    res.status(200).json({ message: subAdmin });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.status(200).json({
      message: "Logout successfull",
    });
  } catch (error) {
    res.status(300).json({
      message: " failed to logout",
    });
  }
};

export const authme = (req, res) => {
  const { accessToken } = req.cookies;
  if (!accessToken) {
    return res.status(401).json({ message: "user Not Authenticate !" });
  }
  try {
    const decode = jwt.verify(accessToken, process.env.JWT_SECRET);
    res.status(200).json({ user: decode });
  } catch (error) {
    res.status(401).json({ message: "user Not Authenticate !" });
  }
};

export const updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    const { _id } = req.user;
    if (!_id && !fcmToken) {
      return res.status(300).json({
        message: "failed save fcmToken",
      });
    }
    await user.updateOne({ _id }, { $set: { fcmToken: fcmToken } });
    res.status(200).json({ message: "Save successfully" });
  } catch (error) {
    res.status(400).json({ message: "failed to save fcmToken" });
  }
};
export const refreshAccessToken = (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Not Authenticate kindly login",
      });
    }
    const decode = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const { _id, FullName, role, subscription } = decode;
    const accessToken = jwt.sign(
      { _id, FullName, role, subscription },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    res.cookie("accessToken", accessToken, accessOptions);
    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(401).json({
      message: "Something went wrong",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { Email } = req.body;
    const existingUser = await user.findOne({ Email });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found with this email!" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and set to resetPasswordToken field
    existingUser.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set expire time (10 minutes)
    existingUser.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await existingUser.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
    try {
      const html =parseTemplate("resetPassword",resetUrl) 
      await emailQueue.add("reset-password-mail", {
        message,
        email: existingUser.Email,
        subject: "Password Reset Token - Movi Booking",
        html,
      });
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.log("Email Error: ", error);
      existingUser.resetPasswordToken = undefined;
      existingUser.resetPasswordExpire = undefined;
      await existingUser.save();
      return res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const existingUser = await user.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "Invalid or Expired password reset link." });
    }

    // Hash new password
    const hasedPassword = await bcrypt.hash(req.body.Password, 10);
    existingUser.Password = hasedPassword;
    existingUser.resetPasswordToken = undefined;
    existingUser.resetPasswordExpire = undefined;

    await existingUser.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
