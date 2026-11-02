import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const userId = req.user?._id?.toString() || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const token = generateStreamToken(userId);
    if (!token) {
      return res.status(500).json({ message: "Failed to generate chat credentials" });
    }

    res.status(200).json({ token });
  } catch (error) {
    console.error("Stream token error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}