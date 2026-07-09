import { create } from "zustand";
import { io } from "socket.io-client";

const getSocketBaseUrl = () => {
  const envUrl = import.meta.env.VITE_SOCKET_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  if (typeof window !== "undefined" && import.meta.env.PROD) return window.location.origin;
  return "http://localhost:5000";
};

const SOCKET_URL = getSocketBaseUrl();

export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  currentRoomId: null,

  setCurrentRoomId: (roomId) => set({ currentRoomId: roomId }),
  clearCurrentRoomId: () => set({ currentRoomId: null }),

  connectSocket: () => {
    const { socket } = get();

    if (socket?.connected) return;

    if (socket && socket.disconnected) {
      socket.removeAllListeners();
      socket.disconnect();
    }

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,  // send httpOnly JWT cookie
      transports: ["websocket", "polling"],
      reconnection:        true,
      reconnectionAttempts: 10,
      reconnectionDelay:   1000,
      path: "/socket.io",
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      set({ isConnected: true });
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      set({ isConnected: false });
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket, currentRoomId } = get();
    if (socket) {
      if (currentRoomId) {
        socket.emit("leave-room", currentRoomId);
      }
      socket.removeAllListeners();
      socket.disconnect();
      set({ socket: null, isConnected: false, currentRoomId: null });
    }
  },
}));