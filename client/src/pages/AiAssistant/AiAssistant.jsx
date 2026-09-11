import React, { useEffect, useRef, useState } from "react";
import {
  FiMessageCircle,
  FiSend,
  FiUser,
  FiCpu,
  FiTrash2,
  FiMic,
  FiMicOff,
  FiVolume2,
  FiVolumeX,
} from "react-icons/fi";
import toast from "react-hot-toast";
import axiosInstance from "../../services/axios";

const welcomeMessage = {
  id: "welcome",
  sender: "ai",
  text:
    "Hello! I am your AI Assistant. You can ask me about resumes, jobs, interviews, or career preparation.",
};

const AiAssistant = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([welcomeMessage]);

  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // ==========================================
  // SCROLL TO BOTTOM
  // ==========================================

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // ==========================================
  // LOAD CHAT HISTORY
  // ==========================================

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await axiosInstance.get("/ai/history");

        const history = response.data?.messages || [];

        const formattedMessages = history.map((item, index) => ({
          id:
            item._id ||
            `${item.role}-${item.createdAt || Date.now()}-${index}`,

          sender:
            item.role === "user"
              ? "user"
              : "ai",

          text: item.message,
        }));

        setMessages(
          formattedMessages.length > 0
            ? formattedMessages
            : [welcomeMessage]
        );
      } catch (error) {
        console.error(
          "Chat history error:",
          error
        );

        if (error.response?.status !== 401) {
          toast.error(
            "Unable to load chat history"
          );
        }
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadChatHistory();
  }, []);

  // ==========================================
  // SPEAK AI RESPONSE
  // ==========================================

  const speakText = (text) => {
    if (!voiceEnabled) {
      return;
    }

    if (
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance =
        new SpeechSynthesisUtterance(text);

      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(
        utterance
      );
    } catch (error) {
      console.error(
        "Speech synthesis error:",
        error
      );

      setIsSpeaking(false);
    }
  };

  // ==========================================
  // STOP AI VOICE
  // ==========================================

  const stopSpeaking = () => {
    if (
      typeof window !== "undefined" &&
      window.speechSynthesis
    ) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };

  // ==========================================
  // SEND MESSAGE TO GEMINI
  // ==========================================

  const sendMessageToAI = async (
    text,
    speakResponse = false
  ) => {
    const trimmedMessage = text.trim();

    if (
      !trimmedMessage ||
      isLoading ||
      isHistoryLoading
    ) {
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userMessage,
    ]);

    setMessage("");
    setIsLoading(true);

    try {
      const response =
        await axiosInstance.post(
          "/ai/chat",
          {
            message: trimmedMessage,
          }
        );

      const reply =
        response.data?.reply ||
        "Sorry, I could not generate a response.";

      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: reply,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiMessage,
      ]);

      // Speak Gemini response
      if (speakResponse) {
        speakText(reply);
      }
    } catch (error) {
      console.error(
        "AI Assistant error:",
        error
      );

      const errorMessage = {
        id: `error-${Date.now()}`,
        sender: "ai",
        text:
          error.response?.data?.message ||
          "AI Assistant is currently unavailable. Please try again.",
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        errorMessage,
      ]);

      toast.error(
        "Unable to get AI response"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // TEXT MESSAGE
  // ==========================================

  const handleSendMessage = async (event) => {
    event.preventDefault();

    await sendMessageToAI(
      message,
      false
    );
  };

  // ==========================================
  // START VOICE RECOGNITION
  // ==========================================

  const startListening = () => {
    if (isLoading || isHistoryLoading) {
      return;
    }

    if (
      typeof window === "undefined"
    ) {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        "Voice input is not supported in this browser. Please use Google Chrome."
      );

      return;
    }

    // Stop existing speech
    stopSpeaking();

    // If already listening, stop it
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const transcript =
          event.results[i][0].transcript;

        if (
          event.results[i].isFinal
        ) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const currentText =
        finalTranscript ||
        interimTranscript;

      setMessage(currentText);

      // When final speech is received,
      // send it to Gemini automatically.
      if (finalTranscript.trim()) {
        sendMessageToAI(
          finalTranscript.trim(),
          true
        );
      }
    };

    recognition.onerror = (event) => {
      console.error(
        "Speech recognition error:",
        event.error
      );

      setIsListening(false);

      if (
        event.error === "not-allowed"
      ) {
        toast.error(
          "Microphone permission was denied."
        );
      } else if (
        event.error === "no-speech"
      ) {
        toast.error(
          "No speech detected. Please try again."
        );
      } else {
        toast.error(
          "Unable to recognize your voice."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current =
      recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error(
        "Unable to start microphone:",
        error
      );

      setIsListening(false);
      recognitionRef.current = null;
    }
  };

  // ==========================================
  // STOP LISTENING
  // ==========================================

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Ignore
      }

      recognitionRef.current = null;
    }

    setIsListening(false);
  };

  // ==========================================
  // VOICE BUTTON
  // ==========================================

  const handleVoiceButton = () => {
    if (isListening) {
      stopListening();
      return;
    }

    startListening();
  };

  // ==========================================
  // TOGGLE VOICE OUTPUT
  // ==========================================

  const toggleVoiceOutput = () => {
    if (voiceEnabled) {
      stopSpeaking();
      setVoiceEnabled(false);
      toast.success(
        "AI voice response turned off"
      );
    } else {
      setVoiceEnabled(true);
      toast.success(
        "AI voice response turned on"
      );
    }
  };

  // ==========================================
  // CLEAR CHAT
  // ==========================================

  const handleClearChat = async () => {
    if (
      isLoading ||
      messages.length <= 1
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to clear your chat history?"
      );

    if (!confirmed) {
      return;
    }

    try {
      stopListening();
      stopSpeaking();

      await axiosInstance.delete(
        "/ai/history"
      );

      setMessages([
        welcomeMessage,
      ]);

      setMessage("");

      toast.success(
        "Chat history cleared"
      );
    } catch (error) {
      console.error(
        "Clear chat error:",
        error
      );

      toast.error(
        "Unable to clear chat history"
      );
    }
  };

  // ==========================================
  // CLEANUP
  // ==========================================

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }

      if (
        typeof window !== "undefined" &&
        window.speechSynthesis
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex max-w-5xl flex-col px-4 py-6 sm:px-6">

        {/* HEADER */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-blue-400">
              <FiMessageCircle className="text-xl" />

              <span className="font-semibold">
                AIHire Assistant
              </span>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">
              AI Assistant
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Get guidance about resumes, jobs,
              interviews, and career growth.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClearChat}
            disabled={
              isLoading ||
              messages.length <= 1
            }
            className="flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FiTrash2 />

            <span className="hidden sm:inline">
              Clear Chat
            </span>
          </button>
        </div>

        {/* CHAT BOX */}

        <div className="flex min-h-[600px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          {/* CHAT HEADER */}

          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                <FiCpu className="text-xl text-blue-400" />
              </div>

              <div>
                <h2 className="font-semibold">
                  AI Career Assistant
                </h2>

                <p className="text-xs text-green-400">
                  {isListening
                    ? "Listening..."
                    : isSpeaking
                    ? "Speaking..."
                    : isLoading
                    ? "Thinking..."
                    : "Online"}
                </p>
              </div>
            </div>

            {/* VOICE OUTPUT BUTTON */}

            <button
              type="button"
              onClick={
                toggleVoiceOutput
              }
              title={
                voiceEnabled
                  ? "Turn AI voice off"
                  : "Turn AI voice on"
              }
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                voiceEnabled
                  ? "border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                  : "border-slate-700 bg-slate-800 text-slate-500 hover:bg-slate-700"
              }`}
            >
              {voiceEnabled ? (
                <FiVolume2 />
              ) : (
                <FiVolumeX />
              )}
            </button>
          </div>

          {/* MESSAGES */}

          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {isHistoryLoading ? (
              <div className="flex items-center justify-center py-10 text-sm text-slate-400">
                Loading chat history...
              </div>
            ) : (
              messages.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-3 ${
                    item.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {item.sender ===
                    "ai" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                      <FiCpu className="text-blue-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 ${
                      item.sender ===
                      "user"
                        ? "rounded-br-sm bg-blue-600 text-white"
                        : "rounded-bl-sm bg-slate-800 text-slate-200"
                    }`}
                  >
                    {item.text}
                  </div>

                  {item.sender ===
                    "user" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800">
                      <FiUser className="text-slate-300" />
                    </div>
                  )}
                </div>
              ))
            )}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                  <FiCpu className="text-blue-400" />
                </div>

                <div className="rounded-2xl rounded-bl-sm bg-slate-800 px-4 py-3 text-sm text-slate-400">
                  AI is thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}

          <form
            onSubmit={
              handleSendMessage
            }
            className="border-t border-slate-800 p-4"
          >
            <div className="flex items-center gap-3">

              {/* TEXT INPUT */}

              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                placeholder={
                  isListening
                    ? "Listening..."
                    : "Ask about resume, jobs, or interviews..."
                }
                disabled={
                  isLoading ||
                  isHistoryLoading
                }
                className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              />

              {/* MIC BUTTON */}

              <button
                type="button"
                onClick={
                  handleVoiceButton
                }
                disabled={
                  isLoading ||
                  isHistoryLoading
                }
                title={
                  isListening
                    ? "Stop listening"
                    : "Speak to AI"
                }
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isListening
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {isListening ? (
                  <FiMicOff className="text-lg" />
                ) : (
                  <FiMic className="text-lg" />
                )}
              </button>

              {/* SEND BUTTON */}

              <button
                type="submit"
                disabled={
                  !message.trim() ||
                  isLoading ||
                  isHistoryLoading
                }
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiSend />
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Your chat history is saved automatically.
              </p>

              <p className="text-xs text-slate-500">
                {isListening
                  ? "🎙️ Listening..."
                  : isSpeaking
                  ? "🔊 AI is speaking..."
                  : "🎙️ Voice available"}
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AiAssistant;