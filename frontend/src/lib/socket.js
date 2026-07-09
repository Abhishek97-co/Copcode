import { io } from "socket.io-client";

const getSocketBaseUrl = () => {
  const envUrl = import.meta.env.VITE_SOCKET_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  if (typeof window !== "undefined" && import.meta.env.PROD) return window.location.origin;
  return "http://localhost:5000";
};

const SOCKET_URL = getSocketBaseUrl();

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      path: "/socket.io",
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};