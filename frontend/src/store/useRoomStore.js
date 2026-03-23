import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const generateSlug = (name = "") => {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug || "room";
};

export const useRoomStore = create((set) => ({
  currentRoom: null,
  myRooms: [],
  isCreating: false,
  isJoining: false,
  isFetchingRoom: false,

  createRoom: async (data) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post("/rooms/create", {
        name: data.name,
        language: data.language,
        maxMembers: data.maxUsers,
        description: data.description || "",
      });

      const room = res.data.room;
      set({ currentRoom: room });

      const slug = generateSlug(room.name);
      toast.success("Room created successfully");

      return { roomId: room.roomId, slug };

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create room");
      return null;
    } finally {
      set({ isCreating: false });
    }
  },

  joinRoom: async (roomId) => {
    set({ isJoining: true });
    try {
      const normalizedId = roomId.trim().toLowerCase();

      const res = await axiosInstance.post("/rooms/join", {
        roomId: normalizedId,
      });

      const room = res.data.room;
      set({ currentRoom: room });

      const slug = generateSlug(room.name);
      toast.success(res.data.message || "Joined room successfully");

      return { roomId: room.roomId, slug };

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to join room");
      return null;
    } finally {
      set({ isJoining: false });
    }
  },

  getRoom: async (roomId) => {
    set({ isFetchingRoom: true });
    try {
      const res = await axiosInstance.get(`/rooms/${roomId}`);
      set({ currentRoom: res.data.room });
      return res.data.room;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Room not found");
      return null;
    } finally {
      set({ isFetchingRoom: false });
    }
  },

  getMyRooms: async () => {
    try {
      const res = await axiosInstance.get("/rooms/my-rooms");
      set({ myRooms: res.data.rooms });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to fetch rooms"
      );
    }
  },

  clearCurrentRoom: () => set({ currentRoom: null }),
}));