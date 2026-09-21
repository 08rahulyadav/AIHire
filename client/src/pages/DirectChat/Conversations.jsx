import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  FiMessageCircle,
  FiUser,
  FiRefreshCw,
} from "react-icons/fi";

import toast from "react-hot-toast";

import axiosInstance from "../../services/axios";
import socket from "../../services/socket";

const Conversations = () => {
  const [conversations, setConversations] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

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
      } catch {
        return null;
      }
    });

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
  // LOAD CONVERSATIONS
  // =====================================================

  const loadConversations =
    async () => {
      try {
        setLoading(true);

        const response =
          await axiosInstance.get(
            "/direct-chat/conversations"
          );

        const list =
          response.data?.conversations ||
          [];

        setConversations(
          Array.isArray(list)
            ? list
            : []
        );
      } catch (error) {
        console.error(
          "Conversations error:",
          error.response?.data ||
            error.message
        );

        toast.error(
          error.response?.data
            ?.message ||
            "Unable to load conversations"
        );
      } finally {
        setLoading(false);
      }
    };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadConversations();
  }, []);

  // =====================================================
  // SOCKET
  // =====================================================

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const joinUser = () => {
      socket.emit(
        "join",
        getId(
          currentUserId
        )
      );
    };

    if (socket.connected) {
      joinUser();
    }

    socket.on(
      "connect",
      joinUser
    );

    // ===================================================
    // NEW MESSAGE
    // ===================================================

    const handleReceiveMessage =
      (newMessage) => {
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

        // Only messages received by current user
        if (
          receiverId !==
          currentId
        ) {
          return;
        }

        setConversations(
          (previous) => {
            const existingIndex =
              previous.findIndex(
                (conversation) =>
                  getId(
                    conversation.user
                  ) === senderId
              );

            // -------------------------------------------
            // EXISTING CONVERSATION
            // -------------------------------------------

            if (
              existingIndex !==
              -1
            ) {
              const updated = [
                ...previous,
              ];

              const existing =
                updated[
                  existingIndex
                ];

              updated[
                existingIndex
              ] = {
                ...existing,

                lastMessage: {
                  ...newMessage,

                  sender: {
                    _id: senderId,
                  },

                  receiver: {
                    _id: receiverId,
                  },
                },

                unreadCount:
                  (existing.unreadCount ||
                    0) + 1,
              };

              // Latest conversation first
              const latest =
                updated.splice(
                  existingIndex,
                  1
                )[0];

              return [
                latest,
                ...updated,
              ];
            }

            // -------------------------------------------
            // NEW CONVERSATION
            // -------------------------------------------

            return [
              {
                user: {
                  _id: senderId,
                  name:
                    "New message",
                },

                lastMessage: {
                  ...newMessage,

                  sender: {
                    _id: senderId,
                  },

                  receiver: {
                    _id: receiverId,
                  },
                },

                unreadCount: 1,
              },

              ...previous,
            ];
          }
        );
      };

    // ===================================================
    // MESSAGES READ
    // ===================================================

    const handleMessagesRead =
      (data) => {
        if (!data) {
          return;
        }

        const readerId =
          getId(
            data.readerId
          );

        const currentId =
          getId(
            currentUserId
          );

        // If another user read our messages,
        // no unread count change is needed here.
        if (
          readerId ===
          currentId
        ) {
          loadConversations();
        }
      };

    socket.on(
      "receive-direct-message",
      handleReceiveMessage
    );

    socket.on(
      "messages-read",
      handleMessagesRead
    );

    // Cleanup
    return () => {
      socket.off(
        "connect",
        joinUser
      );

      socket.off(
        "receive-direct-message",
        handleReceiveMessage
      );

      socket.off(
        "messages-read",
        handleMessagesRead
      );
    };
  }, [
    currentUserId,
  ]);

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (
    date
  ) => {
    if (!date) {
      return "";
    }

    return new Date(
      date
    ).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      <div className="mx-auto max-w-4xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Messages
            </h1>

            <p className="text-sm text-gray-500">
              Your conversations
            </p>
          </div>

          <button
            onClick={
              loadConversations
            }
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <FiRefreshCw
              size={16}
            />

            Refresh
          </button>
        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading conversations...
            </div>
          ) : conversations.length ===
            0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">

              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                <FiMessageCircle
                  size={30}
                />
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                No conversations yet
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your messages will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y">

              {conversations.map(
                (
                  conversation
                ) => {
                  const user =
                    conversation.user;

                  const unreadCount =
                    conversation.unreadCount ||
                    0;

                  const lastMessage =
                    conversation.lastMessage;

                  return (
                    <Link
                      key={getId(
                        user
                      )}
                      to={`/direct-chat/${getId(
                        user
                      )}`}
                      className="flex items-center gap-4 p-4 transition hover:bg-gray-50"
                    >

                      {/* Avatar */}

                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">

                        <FiUser
                          size={22}
                        />

                        {/* Unread dot */}

                        {unreadCount >
                          0 && (
                          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                            {unreadCount >
                            99
                              ? "99+"
                              : unreadCount}
                          </span>
                        )}
                      </div>

                      {/* User information */}

                      <div className="min-w-0 flex-1">

                        <div className="flex items-center justify-between gap-3">

                          <h3
                            className={`truncate ${
                              unreadCount >
                              0
                                ? "font-bold text-gray-900"
                                : "font-semibold text-gray-800"
                            }`}
                          >
                            {user?.name ||
                              user?.email ||
                              "User"}
                          </h3>

                          <span className="shrink-0 text-xs text-gray-400">
                            {formatTime(
                              lastMessage?.createdAt
                            )}
                          </span>
                        </div>

                        <div className="mt-1 flex items-center justify-between gap-3">

                          <p
                            className={`truncate text-sm ${
                              unreadCount >
                              0
                                ? "font-medium text-gray-700"
                                : "text-gray-500"
                            }`}
                          >
                            {lastMessage?.message ||
                              "No message"}
                          </p>

                          {/* Unread count */}

                          {unreadCount >
                            0 && (
                            <span className="shrink-0 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                              {unreadCount}
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs capitalize text-gray-400">
                          {user?.role ||
                            "user"}
                        </p>
                      </div>
                    </Link>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;