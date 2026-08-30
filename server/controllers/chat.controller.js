import ChatMessage from "../models/chat.model.js";
import ai from "../utils/gemini.js";

const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    // Validate message
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const cleanMessage = message.trim();

    // Prevent extremely large messages
    if (cleanMessage.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Message cannot exceed 2000 characters",
      });
    }

    // Authenticated candidate
    const candidateId = req.user._id;

    // Get previous conversation BEFORE saving current message
    const history = await ChatMessage.find({
      candidate: candidateId,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // Reverse so oldest message comes first
    history.reverse();

    const conversation = history
      .map((chat) => `${chat.role}: ${chat.message}`)
      .join("\n");

    const prompt = `
You are AIHire's AI career assistant.

Help the candidate with:
- Resume improvement
- Job search guidance
- Interview preparation
- Technical interview questions
- Career-related questions
- General career-related conversations

Be professional, helpful, and concise.

Previous conversation:
${conversation || "No previous conversation."}

Latest user message:
${cleanMessage}

Reply naturally and helpfully.
`;

    // Generate AI response
    let aiText;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      aiText = response.text?.trim();
    } catch (aiError) {
      console.error("Gemini API error:", aiError);

      return res.status(503).json({
        success: false,
        message: "AI service is temporarily unavailable",
      });
    }

    // Check AI response
    if (!aiText) {
      return res.status(503).json({
        success: false,
        message: "AI returned an empty response",
      });
    }

    // Save user message
    const userMessage = await ChatMessage.create({
      candidate: candidateId,
      role: "user",
      message: cleanMessage,
    });

    // Save AI message
    const assistantMessage = await ChatMessage.create({
      candidate: candidateId,
      role: "assistant",
      message: aiText,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully",

      userMessage: {
        id: userMessage._id,
        role: userMessage.role,
        message: userMessage.message,
        createdAt: userMessage.createdAt,
      },

      aiMessage: {
        id: assistantMessage._id,
        role: assistantMessage.role,
        message: assistantMessage.message,
        createdAt: assistantMessage.createdAt,
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    next(error);
  }
};

const getChatHistory = async (req, res, next) => {
  try {
    const candidateId = req.user._id;

    const messages = await ChatMessage.find({
      candidate: candidateId,
    })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Get chat history error:", error);
    next(error);
  }
};

export {
  sendMessage,
  getChatHistory,
};