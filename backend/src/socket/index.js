import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { registerRoomSocket } from "./room.socket.js";
import { registerEditorSocket } from "./editor.socket.js";
import { registerChatSocket } from "./chat.socket.js";
import { registerWorkspaceSocket } from "./workspace.socket.js";
import { registerFileSocket } from "./file.socket.js";

export const initSocket = (httpServer) => {
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const allowedOrigins = new Set(
    [
      process.env.CLIENT_URL,
      process.env.FRONTEND_URL,
      vercelUrl,
      "https://copcode.vercel.app",
      "https://www.copcode.vercel.app",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ].filter(Boolean)
  );

  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use(async (socket, next) => {
    try {
      const cookie = socket.handshake.headers.cookie;
      if (!cookie) return next(new Error("Not authenticated"));

      const token = cookie
        .split("; ")
        .find((c) => c.startsWith("jwt="))
        ?.split("=")[1];

      if (!token) return next(new Error("Not authenticated"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user    = await User.findById(decoded.userId).select("-password");
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  // register all handlers
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.user.fullName} [${socket.id}]`);

    registerRoomSocket(io, socket);
    registerEditorSocket(io, socket);
    registerChatSocket(io, socket);
    registerWorkspaceSocket(io, socket);
    registerFileSocket(io, socket);
  });

  return io;
};
