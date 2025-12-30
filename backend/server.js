import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { WebSocketServer } from "ws";

dotenv.config({ path: "./.env" });

/* =======================
   BASIC APP SETUP
======================= */
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://cyberpinnacle.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));

/* =======================
   GEMINI INITIALIZATION
======================= */
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* =======================
   IN-MEMORY ADMIN STATS
======================= */
let adminStats = {
  totalChats: 0,
  totalReconIP: 0,
  totalReconDNS: 0,
  totalReconWHOIS: 0,
  totalReconSubdomains: 0,
  totalForensicsAnalyses: 0,
};

let lastChat = null;
let lastRecon = null;
let lastForensics = null;

/* =======================
   WEBSOCKET (SOC STREAM)
======================= */
const wss = new WebSocketServer({ noServer: true });

const broadcast = (event) => {
  const data = JSON.stringify(event);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(data);
    }
  });
};

/* =======================
   HEALTH CHECK
======================= */
app.get("/", (req, res) => {
  res.send("🚀 CyberPinnacle AI Backend (Gemini) Online");
});

/* =======================
   AI CHAT (GEMINI PRO)
======================= */
app.post("/ai", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    adminStats.totalChats++;
    lastChat = {
      prompt,
      timestamp: new Date().toISOString(),
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const result = await model.generateContent(prompt);
    const aiText = result.response.text();

    // 🔔 SOC EVENT
    broadcast({
      type: "AI_CHAT",
      message: "User interacted with Gemini AI",
      timestamp: new Date().toISOString(),
    });

    return res.json({ response: aiText });
  } catch (err) {
    console.error("❌ Gemini AI Error:", err);
    return res.status(500).json({ error: "AI Request Failed" });
  }
});

/* =======================
   ADMIN STATS ENDPOINT
======================= */
app.get("/admin/stats", (req, res) => {
  res.json({
    stats: adminStats,
    lastChat,
    lastRecon,
    lastForensics,
  });
});

/* =======================
   DUMMY RECON EVENT
======================= */
app.post("/recon/event", (req, res) => {
  adminStats.totalReconIP++;

  lastRecon = {
    type: "IP Lookup",
    input: req.body.query || "unknown",
    timestamp: new Date().toISOString(),
  };

  broadcast({
    type: "RECON",
    message: "Recon activity detected",
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true });
});

/* =======================
   OTP (PLACEHOLDER)
======================= */
app.post("/send-otp", async (req, res) => {
  console.log(`📩 OTP requested for ${req.body.email}`);
  res.json({ success: true });
});

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

/* =======================
   WEBSOCKET UPGRADE
======================= */
server.on("upgrade", (req, socket, head) => {
  if (req.url === "/stream") {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  } else {
    socket.destroy();
  }
});
