import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useParams,
  Link,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiSend,
  FiUser,
} from "react-icons/fi";

import toast from "react-hot-toast";

import axiosInstance from "../../services/axios";
import socket from "../../services/socket";

const DirectChat = () => {
  const { userId } = useParams();

  // =====================================================
  // CURRENT USER
  // =====================================================

  const [currentUserId] =
    useState(() => {
      try {
        const user = JSON.parse(
          localStorage.getItem(
            "user"
          ) || "null"
        );

        return (
          user?.id ||
          user?._id ||
          null
        );
      } catch (error) {
        console.error(
          "Current user error:",
          error
        );

        return null;
      }
    });

  // =====================================================
  // STATE
  // =====================================================

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [otherUser, setOtherUser] =
    useState(null);

  const messagesEndRef =
    useRef(null);

  // =====================================================
  // GET ID
  // =====================================================

  const getId = (value) => {
    if (!value) {
      return null;
    }

    if (
      typeof value === "object"
    ) {
      return (
        value._id?.toString() ||
        value.id?.toString() ||
        null
      );
    }

    return value.toString();
  };

  // =====================================================
  // NORMALIZE MESSAGE
  // =====================================================

  const normalizeMessage = (
    item
  ) => {
    if (!item) {
      return null;
    }

    // Socket message
    if (
      item.senderId ||
      item.receiverId
    ) {
      return {
        _id:
          item._id ||
          item.id ||
          `socket-${Date.now()}-${Math.random()}`,

        sender: {
          _id: getId(
            item.senderId
          ),
        },

        receiver: {
          _id: getId(
            item.receiverId
          ),
        },

        message:
          item.message ||
          item.content ||
          "",

        delivered:
          item.delivered ??
          false,

        read:
          item.read ??
          false,

        createdAt:
          item.createdAt ||
          new Date().toISOString(),
      };
    }

    // Database message
    return {
      ...item,

      _id:
        item._id ||
        item.id ||
        `local-${Date.now()}-${Math.random()}`,

      message:
        item.message ||
        item.content ||
        "",

      delivered:
        item.delivered ??
        false,

      read:
        item.read ??
        false,

      createdAt:
        item.createdAt ||
        new Date().toISOString(),
    };
  };

  // =====================================================
  // SCROLL
  // =====================================================

  const scrollToBottom =
    () => {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView(
          {
            behavior:
              "smooth",
          }
        );
      }, 50);
    };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // =====================================================
  // LOAD HISTORY
  // =====================================================

  useEffect(() => {
    let mounted = true;

    const loadChatHistory =
      async () => {
        if (!userId) {
          setLoading(false);
          return;
        }

        try {
          setLoading(true);

          const response =
            await axiosInstance.get(
              `/direct-chat/history/${userId}`
            );

          if (!mounted) {
            return;
          }

          const chatMessages =
            Array.isArray(
              response.data?.messages
            )
              ? response.data.messages
              : Array.isArray(
                  response.data?.data
                )
              ? response.data.data
              : [];

          const normalizedMessages =
            chatMessages
              .map(
                normalizeMessage
              )
              .filter(
                (item) =>
                  item &&
                  item.message
              );

          setMessages(
            normalizedMessages
          );

          // =================================================
          // FIND OTHER USER
          // =================================================

          if (
            normalizedMessages.length >
            0
          ) {
            const firstMessage =
              normalizedMessages[0];

            const sender =
              firstMessage.sender;

            const receiver =
              firstMessage.receiver;

            const senderId =
              getId(sender);

            if (
              senderId ===
              getId(
                currentUserId
              )
            ) {
              setOtherUser(
                receiver
              );
            } else {
              setOtherUser(
                sender
              );
            }
          }

          // =================================================
          // TELL SERVER MESSAGES ARE SEEN
          // =================================================

          if (
            currentUserId &&
            userId
          ) {
            try {
              await axiosInstance.patch(
                `/direct-chat/read/${userId}`
              );
            } catch (readError) {
              console.error(
                "Read update error:",
                readError
              );
            }

            if (
              socket.connected
            ) {
              socket.emit(
                "messages-read",
                {
                  senderId:
                    getId(userId),

                  receiverId:
                    getId(
                      currentUserId
                    ),
                }
              );
            }
          }
        } catch (error) {
          console.error(
            "Chat history error:",
            error.response?.data ||
              error.message
          );

          if (mounted) {
            toast.error(
              error.response?.data
                ?.message ||
                "Unable to load chat"
            );
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    loadChatHistory();

    return () => {
      mounted = false;
    };
  }, [
    userId,
    currentUserId,
  ]);

  // =====================================================
  // SOCKET
  // =====================================================

  useEffect(() => {
    if (
      !currentUserId ||
      !userId
    ) {
      return;
    }

    const joinChat = () => {
      socket.emit(
        "join",
        getId(currentUserId)
      );
    };

    if (!socket.connected) {
      socket.connect();
    }

    if (socket.connected) {
      joinChat();
    }

    socket.on(
      "connect",
      joinChat
    );

    // ===================================================
    // RECEIVE MESSAGE
    // ===================================================

    const handleReceiveMessage =
      async (newMessage) => {
        if (!newMessage) {
          return;
        }

        const senderId =
          getId(
            newMessage.senderId
          );

        const receiverId =
          getId(
            newMessage.receiverId
          );

        const currentId =
          getId(
            currentUserId
          );

        const selectedUserId =
          getId(userId);

        const belongsToCurrentChat =
          senderId ===
            selectedUserId &&
          receiverId ===
            currentId;

        if (
          !belongsToCurrentChat
        ) {
          return;
        }

        const normalizedMessage =
          normalizeMessage(
            newMessage
          );

        if (
          !normalizedMessage?.message
        ) {
          return;
        }

        // =================================================
        // ADD MESSAGE
        // =================================================

        setMessages(
          (previousMessages) => {
            const alreadyExists =
              previousMessages.some(
                (item) =>
                  item._id ===
                  normalizedMessage._id
              );

            if (
              alreadyExists
            ) {
              return previousMessages;
            }

            return [
              ...previousMessages,
              normalizedMessage,
            ];
          }
        );

        // =================================================
        // MESSAGE IS DELIVERED
        // =================================================

        socket.emit(
          "message-delivered",
          {
            messageId:
              getId(
                newMessage._id
              ),

            senderId:
              senderId,

            receiverId:
              receiverId,
          }
        );

        // =================================================
        // CHAT IS OPEN -> MESSAGE IS SEEN
        // =================================================

        try {
          await axiosInstance.patch(
            `/direct-chat/read/${userId}`
          );

          socket.emit(
            "messages-read",
            {
              senderId:
                senderId,

              receiverId:
                currentId,
            }
          );

          // Immediately update local message
          setMessages(
            (previousMessages) =>
              previousMessages.map(
                (item) =>
                  item._id ===
                  normalizedMessage._id
                    ? {
                        ...item,
                        delivered:
                          true,
                        read: true,
                      }
                    : item
              )
          );
        } catch (error) {
          console.error(
            "Mark read error:",
            error
          );
        }
      };

    socket.on(
      "receive-direct-message",
      handleReceiveMessage
    );

    // ===================================================
    // DELIVERED
    // ===================================================

    const handleMessageDelivered =
      (data) => {
        const messageId =
          getId(
            data?.messageId
          );

        if (!messageId) {
          return;
        }

        setMessages(
          (previousMessages) =>
            previousMessages.map(
              (item) =>
                getId(item._id) ===
                messageId
                  ? {
                      ...item,
                      delivered:
                        true,
                    }
                  : item
            )
        );
      };

    socket.on(
      "message-delivered",
      handleMessageDelivered
    );

    // ===================================================
    // SEEN / BLUE TICK
    // ===================================================

    const handleMessagesRead =
      (data) => {
        const senderId =
          getId(
            data?.senderId
          );

        const receiverId =
          getId(
            data?.receiverId
          );

        if (
          senderId !==
          getId(currentUserId)
        ) {
          return;
        }

        if (
          receiverId !==
          getId(userId)
        ) {
          return;
        }

        setMessages(
          (previousMessages) =>
            previousMessages.map(
              (item) => {
                const itemSender =
                  getId(
                    item.sender
                  );

                const itemReceiver =
                  getId(
                    item.receiver
                  );

                if (
                  itemSender ===
                    senderId &&
                  itemReceiver ===
                    receiverId
                ) {
                  return {
                    ...item,
                    delivered:
                      true,
                    read: true,
                  };
                }

                return item;
              }
            )
        );
      };

    socket.on(
      "messages-read",
      handleMessagesRead
    );

    // ===================================================
    // CLEANUP
    // ===================================================

    return () => {
      socket.off(
        "connect",
        joinChat
      );

      socket.off(
        "receive-direct-message",
        handleReceiveMessage
      );

      socket.off(
        "message-delivered",
        handleMessageDelivered
      );

      socket.off(
        "messages-read",
        handleMessagesRead
      );
    };
  }, [
    currentUserId,
    userId,
  ]);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSendMessage =
    async (event) => {
      event.preventDefault();

      const trimmedMessage =
        message.trim();

      if (
        !trimmedMessage ||
        sending ||
        !currentUserId ||
        !userId
      ) {
        return;
      }

      try {
        setSending(true);

        // =================================================
        // SAVE IN DATABASE
        // =================================================

        const response =
          await axiosInstance.post(
            "/direct-chat/send",
            {
              receiverId:
                getId(userId),

              message:
                trimmedMessage,
            }
          );

        const savedMessage =
          response.data?.data;

        // =================================================
        // ADD TO UI
        // =================================================

        if (savedMessage) {
          const normalizedMessage =
            normalizeMessage(
              savedMessage
            );

          setMessages(
            (previousMessages) => {
              const exists =
                previousMessages.some(
                  (item) =>
                    getId(
                      item._id
                    ) ===
                    getId(
                      normalizedMessage._id
                    )
                );

              if (exists) {
                return previousMessages;
              }

              return [
                ...previousMessages,
                normalizedMessage,
              ];
            }
          );

          // =================================================
          // SOCKET
          // =================================================

          if (socket.connected) {
            socket.emit(
              "send-direct-message",
              {
                messageId:
                  getId(
                    savedMessage._id
                  ),

                senderId:
                  getId(
                    currentUserId
                  ),

                receiverId:
                  getId(userId),

                message:
                  trimmedMessage,
              }
            );
          }
        }

        // =================================================
        // CLEAR INPUT
        // =================================================

        setMessage("");
      } catch (error) {
        console.error(
          "Send message error:",
          error.response?.data ||
            error.message
        );

        toast.error(
          error.response?.data
            ?.message ||
            "Unable to send message"
        );
      } finally {
        setSending(false);
      }
    };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 p-6 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
            <p className="text-slate-400">
              Loading chat...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-white">
      <div className="mx-auto flex max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

        {/* HEADER */}

        <div className="flex items-center gap-4 border-b border-slate-800 px-5 py-4">

          <Link
            to="/direct-chat"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <FiArrowLeft />
          </Link>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-500/10">
            <FiUser className="text-xl text-blue-400" />
          </div>

          <div>
            <h1 className="font-semibold">
              {otherUser?.name ||
                "Direct Chat"}
            </h1>

            <p className="text-xs text-green-400">
              Direct Chat
            </p>
          </div>
        </div>

        {/* MESSAGES */}

        <div className="min-h-[550px] flex-1 space-y-4 overflow-y-auto p-5">

          {messages.length === 0 ? (
            <div className="flex min-h-[450px] items-center justify-center">
              <div className="text-center">

                <FiUser className="mx-auto mb-3 text-4xl text-slate-600" />

                <p className="text-slate-400">
                  No messages yet.
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Start the conversation.
                </p>

              </div>
            </div>
          ) : (
            messages.map(
              (item, index) => {
                const senderId =
                  getId(
                    item.sender
                  );

                const isMine =
                  senderId ===
                  getId(
                    currentUserId
                  );

                return (
                  <div
                    key={
                      item._id ||
                      `message-${index}`
                    }
                    className={`flex ${
                      isMine
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                        isMine
                          ? "rounded-br-sm bg-blue-600 text-white"
                          : "rounded-bl-sm bg-slate-800 text-slate-200"
                      }`}
                    >

                      {/* MESSAGE TEXT */}

                      <p className="whitespace-pre-wrap break-words">
                        {item.message}
                      </p>

                      {/* TIME + TICK */}

                      <div
                        className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                          isMine
                            ? "text-blue-200"
                            : "text-slate-500"
                        }`}
                      >

                        <span>
                          {new Date(
                            item.createdAt
                          ).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute:
                                "2-digit",
                            }
                          )}
                        </span>

                        {/* =================================================
                            WHATSAPP STYLE STATUS
                        ================================================= */}

                        {isMine && (
                          <span
                            className={`text-[14px] font-semibold leading-none ${
                              item.read
                                ? "text-blue-400"
                                : "text-gray-300"
                            }`}
                            title={
                              item.read
                                ? "Seen"
                                : item.delivered
                                ? "Delivered"
                                : "Sent"
                            }
                          >
                            {item.read
                              ? "✓✓"
                              : item.delivered
                              ? "✓✓"
                              : "✓"}
                          </span>
                        )}

                      </div>
                    </div>
                  </div>
                );
              }
            )
          )}

          <div
            ref={messagesEndRef}
          />

        </div>

        {/* INPUT */}

        <form
          onSubmit={
            handleSendMessage
          }
          className="border-t border-slate-800 p-4"
        >

          <div className="flex items-center gap-3">

            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              placeholder="Type a message..."
              disabled={
                sending ||
                !currentUserId
              }
              autoComplete="off"
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-white px-4 py-3 text-sm text-gray-900 caret-blue-600 outline-none placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={
                !message.trim() ||
                sending ||
                !currentUserId
              }
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiSend />
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};

export default DirectChat;