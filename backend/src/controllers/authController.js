const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/appError");
const prisma = require("../config/prisma");
const { sendEmail } = require("../services/email");
const { addNotification } = require("./notificationController");

const generateAccessToken = (minUserData) => {
  return jwt.sign(minUserData, process.env.JWT_SECRET || "secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d", // Increased for simplicity in MVP
  });
};

exports.register = async (req, res, next) => {
  /* #swagger.tags = ['User']*/
  try {
    const { email, password, name, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(AppError.conflict("Email already in use!"));
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        name,
        role: role || "READER" // Allow setting role for dev/testing
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    const minUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(minUserData);

    res.status(201).json({
      status: "success",
      token: accessToken,
      user
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  /* #swagger.tags = ['User']*/
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(AppError.unauthorized("Invalid credentials!"));
    }
    const minUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(minUserData);
    
    res.status(200).json({
      status: "success",
      token: accessToken,
      user: minUserData
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  /* #swagger.tags = ['User']*/
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

exports.getMe = (req, res) => {
  /* #swagger.tags = ['User']*/
  res.status(200).json({
    status: "success",
    user: req.user,
  });
};

exports.changePassword = async (req, res, next) => {
  /* #swagger.tags = ['User']*/
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return next(AppError.userNotFound("User not found!"));

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "fail",
        message: "Old password is incorrect!",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 8);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  /* #swagger.tags = ['User']*/
  try {
    const { token, newPassword } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      if (decoded.type !== "passwordReset") {
        return res.status(400).json({ message: "Invalid token type!" });
      }
    } catch (err) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid or expired reset token! Request a new link.",
      });
    }
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return next(AppError.userNotFound("User not found!"));

    const hashedNewPassword = await bcrypt.hash(newPassword, 8);
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedNewPassword },
    });

    res.status(200).json({
      status: "success",
      message: "Password reset successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.sendPassResetLinkEmail = async (req, res, next) => {
  /* #swagger.tags = ['User']*/
  try {
    const { email } = req.body;
    if (!email) return next(AppError.badRequest("Email is required!"));
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return next(AppError.userNotFound("User not found!"));

    const token = jwt.sign(
      { id: user.id, type: "passwordReset" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );
    const resetLink = `${process.env.FRONTEND_URL}/auth/change-password?token=${token}`;

    // Send email
    await sendEmail({
      sendTo: email,
      senderName: process.env.PROJECT_NAME,
      emailSubject: "Reset Password Instructions",
      htmlTemplate: "reset-password.html",
      templateData: {
        name: user.name,
        resetLink,
        year: new Date().getFullYear(),
      },
    });

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to your email!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" }
    });

    res.status(200).json({
      status: "success",
      users
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    
    if (!["READER", "JOURNALIST", "FACT_CHECKER", "EDITOR", "ADMIN"].includes(role)) {
      return next(AppError.badRequest("Invalid role"));
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    res.status(200).json({
      status: "success",
      user
    });
  } catch (err) {
    next(err);
  }
};
