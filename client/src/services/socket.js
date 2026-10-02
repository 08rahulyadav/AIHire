import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_URL ||
    "https://aihire-backend-6b9k.onrender.com",
  {
    autoConnect: false,

    transports: [
      "websocket",
      "polling",
    ],
  }
);

export default socket;