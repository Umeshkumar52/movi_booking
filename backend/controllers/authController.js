import user from "../models/auth.js";
import comparePassword from "../middilwares/comparePassword.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import generateToken from "../middilwares/generateToken.js";
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
    const subAdmin = await user.find({role:"subAdmin"});
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
