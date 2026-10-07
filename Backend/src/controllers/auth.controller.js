import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const DEMO_USERS = {
  user1: {
    fullName: "Alex Miller",
    email: "alex.demo@connectify.com",
    password: "demoPassword123",
    nativeLanguage: "english",
    learningLanguage: "spanish",
    location: "New York, USA",
    bio: "Hi! Native English speaker looking to practice conversational Spanish. Excited to connect!",
    profilePic: "https://api.dicebear.com/9.x/adventurer/svg?seed=AlexMillerDemo",
  },
  user2: {
    fullName: "Elena Gomez",
    email: "elena.demo@connectify.com",
    password: "demoPassword123",
    nativeLanguage: "spanish",
    learningLanguage: "english",
    location: "Madrid, Spain",
    bio: "Hola! Native Spanish speaker practicing my English for work and travel. Let's practice together!",
    profilePic: "https://api.dicebear.com/9.x/adventurer/svg?seed=ElenaGomezDemo",
  },
};

export async function demoLogin(req, res) {
  try {
    const { demoType } = req.body;
    const selectedDemo = DEMO_USERS[demoType] || DEMO_USERS.user1;

    let user1Doc = await User.findOne({ email: DEMO_USERS.user1.email });
    if (!user1Doc) {
      user1Doc = await User.create({
        ...DEMO_USERS.user1,
        isOnboarded: true,
      });
    }

    let user2Doc = await User.findOne({ email: DEMO_USERS.user2.email });
    if (!user2Doc) {
      user2Doc = await User.create({
        ...DEMO_USERS.user2,
        isOnboarded: true,
      });
    }

    await User.findByIdAndUpdate(user1Doc._id, {
      $addToSet: { friends: user2Doc._id },
      isOnboarded: true,
    });

    await User.findByIdAndUpdate(user2Doc._id, {
      $addToSet: { friends: user1Doc._id },
      isOnboarded: true,
    });

    await upsertStreamUser({
      id: user1Doc._id.toString(),
      name: user1Doc.fullName,
      image: user1Doc.profilePic,
    });

    await upsertStreamUser({
      id: user2Doc._id.toString(),
      name: user2Doc.fullName,
      image: user2Doc.profilePic,
    });

    const activeUser = demoType === "user2" ? user2Doc : user1Doc;
    const freshUser = await User.findById(activeUser._id).select("-password");

    const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
    const token = jwt.sign({ userId: freshUser._id }, jwtSecret, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user: freshUser });
  } catch (error) {
    console.error("Demo login error:", error.message);
    res.status(500).json({ message: "Demo login failed. Please try again." });
  }
}

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const randomSeed = Math.random().toString(36).substring(2, 10);
    const randomAvatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${randomSeed}`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic || "",
    });

    const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
    const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ success: true, user: newUser });
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

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "7d" });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, user });
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
    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    ).select("-password");

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
    if (fullName !== undefined) updateData.fullName = fullName.trim();
    if (bio !== undefined) updateData.bio = bio;
    if (nativeLanguage !== undefined) updateData.nativeLanguage = nativeLanguage;
    if (learningLanguage !== undefined) updateData.learningLanguage = learningLanguage;
    if (location !== undefined) updateData.location = location;
    if (profilePic !== undefined) updateData.profilePic = profilePic;

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