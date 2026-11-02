import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const trimmedFullName = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (trimmedFullName.length < 2 || trimmedFullName.length > 70) {
      return res.status(400).json({ message: "Full name must be between 2 and 70 characters" });
    }

    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ message: "Password must be between 6 and 128 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const randomSeed = Math.random().toString(36).substring(2, 10);
    const randomAvatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${randomSeed}`;

    const newUser = await User.create({
      email: normalizedEmail,
      fullName: trimmedFullName,
      password,
      profilePic: randomAvatar,
    });

    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic || "",
    });

    const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT Secret is not configured.");
    }

    const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT Secret is not configured.");
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({ success: true, user: userResponse });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sanitizedUpdate = {
      fullName: fullName.trim(),
      bio: bio.trim(),
      nativeLanguage: nativeLanguage.trim().toLowerCase(),
      learningLanguage: learningLanguage.trim().toLowerCase(),
      location: location.trim(),
      isOnboarded: true,
    };

    if (profilePic && typeof profilePic === "string") {
      sanitizedUpdate.profilePic = profilePic.trim();
    }

    const updatedUser = await User.findByIdAndUpdate(userId, sanitizedUpdate, { new: true }).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePic || "",
    });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateProfile(req, res) {
  try {
    const userId = req.user._id;
    const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic } = req.body;

    const updateData = {};
    if (fullName !== undefined && typeof fullName === "string") {
      const trimmedName = fullName.trim();
      if (trimmedName.length >= 2 && trimmedName.length <= 70) {
        updateData.fullName = trimmedName;
      }
    }
    if (bio !== undefined && typeof bio === "string") updateData.bio = bio.trim().slice(0, 500);
    if (nativeLanguage !== undefined && typeof nativeLanguage === "string") {
      updateData.nativeLanguage = nativeLanguage.trim().toLowerCase();
    }
    if (learningLanguage !== undefined && typeof learningLanguage === "string") {
      updateData.learningLanguage = learningLanguage.trim().toLowerCase();
    }
    if (location !== undefined && typeof location === "string") updateData.location = location.trim().slice(0, 100);
    if (profilePic !== undefined && typeof profilePic === "string") updateData.profilePic = profilePic.trim();

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profilePic || "",
    });

    res.status(200).json({ success: true, user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}