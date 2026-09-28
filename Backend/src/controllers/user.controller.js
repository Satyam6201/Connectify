import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";
import { redis } from "../lib/redis.js";

// Helper to clear user-related cache keys in Redis
const invalidateUserCache = async (userId) => {
    try {
        if (redis.status === "ready") {
            await redis.del(`friends:${userId}`);
            await redis.del(`recommendations:${userId}`);
        }
    } catch (err) {
        console.error("Redis cache invalidation error:", err.message);
    }
};

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;
        const { search, nativeLanguage, learningLanguage, limit = 50, page = 1 } = req.query;

        const parsedLimit = Math.min(Math.max(parseInt(limit) || 50, 1), 100);
        const skip = (Math.max(parseInt(page) || 1, 1) - 1) * parsedLimit;

        // Build query filters
        const filter = {
            _id: { $ne: currentUserId, $nin: currentUser.friends || [] },
            isOnboarded: true,
        };

        if (search && search.trim()) {
            filter.fullName = { $regex: search.trim(), $options: "i" };
        }

        if (nativeLanguage && nativeLanguage.trim()) {
            filter.nativeLanguage = nativeLanguage.trim().toLowerCase();
        }

        if (learningLanguage && learningLanguage.trim()) {
            filter.learningLanguage = learningLanguage.trim().toLowerCase();
        }

        // Use .lean() for blazing-fast serialization without Mongoose overhead
        const recommendedUsers = await User.find(filter)
            .select("fullName profilePic nativeLanguage learningLanguage bio location createdAt")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parsedLimit)
            .lean();

        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getMyFriends(req, res) {
    try {
        const currentUserId = req.user.id;
        const cacheKey = `friends:${currentUserId}`;

        // Check Redis cache first
        if (redis.status === "ready") {
            const cachedFriends = await redis.get(cacheKey);
            if (cachedFriends) {
                return res.status(200).json(JSON.parse(cachedFriends));
            }
        }

        const user = await User.findById(currentUserId)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage bio location");

        const friendsList = user?.friends || [];

        // Save in Redis with 2-minute expiration
        if (redis.status === "ready") {
            await redis.set(cacheKey, JSON.stringify(friendsList), "EX", 120);
        }

        res.status(200).json(friendsList);
    } catch (error) {
        console.error("Error in getMyFriends controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;

        if (myId === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        if (recipient.friends?.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });

        if (existingRequest) {
            return res.status(400).json({ message: "A friend request already exists between you and this user" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        await invalidateUserCache(myId);
        await invalidateUserCache(recipientId);

        res.status(201).json(friendRequest);
    } catch (error) {
        console.error("Error in sendFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const currentUserId = req.user.id;

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.recipient.toString() !== currentUserId) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        // Mutually add friends
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        });

        await invalidateUserCache(friendRequest.sender.toString());
        await invalidateUserCache(friendRequest.recipient.toString());

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.error("Error in acceptFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function rejectFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const currentUserId = req.user.id;

        const friendRequest = await FriendRequest.findOne({
            _id: requestId,
            recipient: currentUserId,
            status: "pending",
        });

        if (!friendRequest) {
            return res.status(404).json({ message: "Pending friend request not found" });
        }

        await FriendRequest.findByIdAndDelete(requestId);

        await invalidateUserCache(currentUserId);
        await invalidateUserCache(friendRequest.sender.toString());

        res.status(200).json({ message: "Friend request rejected successfully" });
    } catch (error) {
        console.error("Error in rejectFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function cancelFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const currentUserId = req.user.id;

        const friendRequest = await FriendRequest.findOne({
            _id: requestId,
            sender: currentUserId,
            status: "pending",
        });

        if (!friendRequest) {
            return res.status(404).json({ message: "Pending outgoing friend request not found" });
        }

        await FriendRequest.findByIdAndDelete(requestId);

        await invalidateUserCache(currentUserId);
        await invalidateUserCache(friendRequest.recipient.toString());

        res.status(200).json({ message: "Friend request cancelled successfully" });
    } catch (error) {
        console.error("Error in cancelFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function removeFriend(req, res) {
    try {
        const currentUserId = req.user.id;
        const { id: friendId } = req.params;

        // Remove from current user's friends list
        await User.findByIdAndUpdate(currentUserId, {
            $pull: { friends: friendId },
        });

        // Remove from the other user's friends list
        await User.findByIdAndUpdate(friendId, {
            $pull: { friends: currentUserId },
        });

        // Clean up any friend request record between both users
        await FriendRequest.deleteMany({
            $or: [
                { sender: currentUserId, recipient: friendId },
                { sender: friendId, recipient: currentUserId },
            ],
        });

        await invalidateUserCache(currentUserId);
        await invalidateUserCache(friendId);

        res.status(200).json({ message: "Friend removed successfully" });
    } catch (error) {
        console.error("Error in removeFriend controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getFriendRequest(req, res) {
    try {
        const incomingReqs = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage bio location");

        const acceptedReqs = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json({ incomingReqs, acceptedReqs });
    } catch (error) {
        console.error("Error in getFriendRequest controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getOutgoingFriendReqs(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending",
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage bio location");

        res.status(200).json({ outgoingRequests });
    } catch (error) {
        console.error("Error in getOutgoingFriendReqs controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}