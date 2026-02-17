import user from "../models/auth.js";
import comparePassword from "../middilwares/comparePassword.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import generateToken from "../middilwares/generateToken.js";
const accessOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge:30* 60 * 1000,
};
const refreshOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 15 * 24 * 60 * 60 * 1000,
};
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

    const { accessToken, refreshToken } = generateToken({
      _id: newUSer._id,
      role: newUSer.role,
    });
    res.cookie("refreshToken", refreshToken, refreshOptions);
    res.cookie("accessToken", accessToken, accessOptions);
    return res.status(200).json({
      message: newUSer,
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
    const { accessToken, refreshToken } = generateToken({
      _id: response._id,
      role: response.role,
    });
    res.cookie("refreshToken", refreshToken, refreshOptions);
    res.cookie("accessToken", accessToken, accessOptions);

    return res.status(200).json({
      message: response,
      accessToken: accessToken,
    });
  } catch (error) {
    return res.status(301).json({
      message: "Something went wrong !",
    });
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

export const updateFmcToken = async (req, res) => {
  try {
    const { fmcToken } = req.body;
    const { _id } = req.user;
    if (!_id && !fmcToken) {
      return res.status(300).json({
        message: "failed save fcmToken",
      });
    }
    await user.updateOne({ _id }, { $set: { fcmToken: fmcToken } });
    res.status(200).json({ message: "Save successfully" });
  } catch (error) {
    res.status(400).json({ message: "failed to save fmcToken" });
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

    const accessToken = jwt.sign(
      { _id: decode._id, role: decode.role },
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
