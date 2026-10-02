import axios from "./axios";

// ==========================================
// SEND DIRECT MESSAGE
// ==========================================

const sendDirectMessage = async (receiverId, message) => {
  const response = await axios.post("/direct-chat/send", {
    receiverId,
    message,
  });

  return response.data;
};

// ==========================================
// GET CHAT HISTORY
// ==========================================

const getDirectChatHistory = async (userId) => {
  const response = await axios.get(
    `/direct-chat/history/${userId}`
  );

  return response.data;
};

// ==========================================
// GET ALL CONVERSATIONS
// ==========================================

const getDirectConversations = async () => {
  const response = await axios.get(
    "/direct-chat/conversations"
  );

  return response.data;
};

export {
  sendDirectMessage,
  getDirectChatHistory,
  getDirectConversations,
};