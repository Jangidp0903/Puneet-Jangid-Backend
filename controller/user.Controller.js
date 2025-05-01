// Import
import bcrypt from "bcryptjs";
import User from "../models/user.Model.js";
import { ErrorHandler } from "../middleware/errorHandler.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

// Register User
export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

// Login User
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("Invalid Email", 400));
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid Password", 400));
    }

    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    next(error);
  }
};

// Logout User
export const logoutUser = async (req, res, next) => {
  try {
    return res
      .status(200)
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
      })
      .json({
        message: "User logged out successfully",
        success: true,
      });
  } catch (error) {
    next(error);
  }
};

// Get User
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById("680b0bdd656fe7247ffe6894").select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Update Password
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!currentPassword || !newPassword || !confirmPassword) {
      return next(new ErrorHandler("All fields are required", 400));
    }

    // Find user by ID from token (auth middleware should attach req.user)
    const user = await User.findById(req.user);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Check current password match
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new ErrorHandler("Current password is incorrect", 400));
    }

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      return next(
        new ErrorHandler("New password and confirm password do not match", 400)
      );
    }

    // Hash new password and update
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Update User
export const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.designation = req.body.designation || user.designation;
    user.aboutMe = req.body.aboutMe || user.aboutMe;

    // For file fields, update only if new file is uploaded
    if (req.files?.profileImage?.[0]) {
      user.profileImage = req.files.profileImage[0].path;
    }

    if (req.files?.resume?.[0]) {
      user.resume = req.files.resume[0].path;
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Forgot Password
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.DASHBOARD_URL}/reset-password/${resetToken}`;

    // Clean, modern email design without gradients or footer
    const emailContent = `
    <div style="font-family: 'Helvetica', Arial, sans-serif; line-height: 1.6; color: #333333; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
      <!-- Header -->
      <div style="background-color: #ff6b6b; padding: 25px 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 500;">Password Reset</h1>
      </div>
      
      <!-- Main Content -->
      <div style="padding: 35px 30px; background-color: #ffffff;">
        <p style="margin-top: 0; font-size: 16px; color: #333333;">Hello ${
          user.fullName || "there"
        },</p>
        
        <p style="font-size: 16px; color: #333333; line-height: 1.6;">You requested to reset your password for your personal portfolio account. Please click the button below to create a new password:</p>
        
        <!-- Reset Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="display: inline-block; background-color: #ff6b6b; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px; box-shadow: 0 2px 4px rgba(255, 107, 107, 0.2);">Reset Password</a>
        </div>
        
        <!-- Security Notice -->
        <div style="background-color: #fff5f5; padding: 15px; border-radius: 6px; margin-bottom: 25px; border: 1px solid #ffebeb;">
          <p style="margin: 0; font-size: 14px; color: #555555;">
            <span style="color: #ff6b6b; font-weight: 600;">Important:</span> This link will expire in 15 minutes. If you need a new reset link after that, you'll need to submit another request.
          </p>
        </div>
        
        <!-- Help Text -->
        <p style="font-size: 15px; color: #666666; margin-bottom: 25px;">If you did not request a password reset, please ignore this email. Your account security is important to me.</p>
        
        <!-- Alternative Link -->
        <div style="background-color: #fff5f5; padding: 15px; border-radius: 6px; border: 1px solid #ffebeb;">
          <p style="font-size: 14px; color: #555555; margin: 0 0 8px 0;">If the button doesn't work, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; font-size: 13px; color: #ff6b6b; margin: 0;">${resetUrl}</p>
        </div>
        
        <!-- Signature -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ffebeb;">
          <p style="margin: 0; font-size: 14px; color: #666666;">Best regards,<br>Your Portfolio Admin</p>
        </div>
      </div>
      
      <!-- Optional Footer Banner -->
      <div style="background-color: #fff5f5; padding: 15px; text-align: center; font-size: 13px; color: #666666; border-top: 1px solid #ffebeb;">
        <p style="margin: 0;">This is an automated message from your personal portfolio system.</p>
      </div>
    </div>
  `;

    await sendEmail(user.email, "Password Reset Request", emailContent);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorHandler("Token is invalid or expired", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
