import express from "express";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import http from "http";
import path from "path";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Simple chat storage
  const messages: any[] = [];

  // Gamification State (In-memory for demo)
  let userProfile = {
    points: 1250,
    streak: 12,
    goalsCompleted: 8,
    badges: [
      { icon: "🌱", label: "Seedling" },
      { icon: "🔥", label: "On Fire" },
      { icon: "💎", label: "Valuable" },
    ],
    completedActions: [] as string[], // e.g., "reflection-2026-03-06"
  };

  app.get("/api/profile", (req, res) => {
    res.json(userProfile);
  });

  app.post("/api/gamification/action", (req, res) => {
    const { action, points, badge } = req.body;
    
    // Prevent duplicate points for same daily action
    if (action.startsWith("daily-") && userProfile.completedActions.includes(action)) {
      return res.json({ success: false, message: "Already completed today", profile: userProfile });
    }

    userProfile.points += points;
    if (action) userProfile.completedActions.push(action);
    
    if (badge && !userProfile.badges.find(b => b.label === badge.label)) {
      userProfile.badges.push(badge);
    }

    // Special milestone logic
    if (action === "first-vision" && !userProfile.badges.find(b => b.label === "First Vision Blueprint")) {
      userProfile.badges.push({ icon: "🗺️", label: "First Vision Blueprint" });
    }

    res.json({ success: true, profile: userProfile });
  });

  app.post("/api/gamification/goal", (req, res) => {
    userProfile.goalsCompleted += 1;
    userProfile.points += 100;
    res.json({ success: true, profile: userProfile });
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    
    // Send existing messages
    socket.emit("chat:history", messages);

    socket.on("chat:message", (msg) => {
      const message = {
        id: Date.now().toString(),
        text: msg.text,
        user: msg.user,
        timestamp: new Date().toISOString(),
      };
      messages.push(message);
      if (messages.length > 100) messages.shift(); // Keep last 100
      io.emit("chat:message", message);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
