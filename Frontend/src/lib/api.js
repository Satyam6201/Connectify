import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const demoLogin = async (demoType) => {
  const response = await axiosInstance.post("/auth/demo-login", { demoType });
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch {
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export const updateProfile = async (userData) => {
  const response = await axiosInstance.put("/auth/profile", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function removeFriend(friendId) {
  const response = await axiosInstance.delete(`/users/friends/${friendId}`);
  return response.data;
}

export async function getRecommendedUsers(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append("search", filters.search);
  if (filters.nativeLanguage) params.append("nativeLanguage", filters.nativeLanguage);
  if (filters.learningLanguage) params.append("learningLanguage", filters.learningLanguage);

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const response = await axiosInstance.get(`/users${queryString}`);
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data.outgoingRequests || [];
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}

export async function rejectFriendRequest(requestId) {
  const response = await axiosInstance.delete(`/users/friend-request/${requestId}/reject`);
  return response.data;
}

export async function cancelFriendRequest(requestId) {
  const response = await axiosInstance.delete(`/users/friend-request/${requestId}/cancel`);
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export async function translateText(text, targetLanguage) {
  const response = await axiosInstance.post("/ai/translate", { text, targetLanguage });
  return response.data;
}

export async function checkGrammar(text, learningLanguage) {
  const response = await axiosInstance.post("/ai/grammar-check", { text, learningLanguage });
  return response.data;
}

export async function chatWithAI(data) {
  const response = await axiosInstance.post("/ai/chat", data);
  return response.data;
}

export async function generateAIImage(data) {
  const response = await axiosInstance.post("/ai/generate-image", data);
  return response.data;
}