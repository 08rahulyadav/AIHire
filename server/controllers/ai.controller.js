import ai from "../utils/gemini.js";
import ChatMessage from "../models/chat.model.js";

const chatWithAI = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const candidateId = req.user._id;

    // Save user message
    await ChatMessage.create({
      candidate: candidateId,
      role: "user",
      message: message.trim(),
    });

    // Generate AI response
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: message.trim(),
    });

    const reply =
      interaction.output_text || "Sorry, I could not generate a response.";

    // Save AI message
    await ChatMessage.create({
      candidate: candidateId,
      role: "assistant",
      message: reply,
    });

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    next(error);
  }
};

const getChatHistory = async (req, res, next) => {
  try {
    const messages = await ChatMessage.find({
      candidate: req.user._id,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

const clearChatHistory = async (req, res, next) => {
  try {
    await ChatMessage.deleteMany({
      candidate: req.user._id,
    });

    return res.status(200).json({
      success: true,
      message: "Chat history cleared successfully",
    });
  } catch (error) {
    next(error);
  }
};

export {
  chatWithAI,
  getChatHistory,
  clearChatHistory,
};