import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing");
}

const steamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await steamClient.upsertUsers([userData]);
        return userData;

    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
};

export const generateStreamToken = (userId) => {
    try {
        // ensure userId is a string
        const userIdStr = userId.toString();
        return steamClient.createToken(userIdStr);

    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
};